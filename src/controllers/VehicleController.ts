import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import Vehicles from '../models/Vehicles';
import VehicleMarca from '../models/VehicleMarca';
import VehicleImage from '../models/VehicleImage';
import VehicleToOptional from '../models/VehicleToOptional';
import sequelize from '../database/sequelize';
import VehicleAno from '../models/VehicleAno';
import VehicleCor from '../models/VehicleCor';
import TipoCombustivel from '../models/VehicleTipoCombustivel';
import Transmissao from '../models/VehicleTransmissao';
import VehicleCategories from '../models/VehicleCategories';
import VehicleOptional from '../models/VehicleOptional';
import CacheService from '../services/SimpleCacheService';

declare module '../models/Vehicles' {
  interface Vehicles {
    images?: VehicleImage[];
    vehicleOptionals?: VehicleToOptional[];
  }
}

class VehicleController {
    // Get all vehicles
    static async index(_req: Request, res: Response) {
        try {
            const cacheKey = 'vehicles:all';
            const cached = CacheService.get(cacheKey);
            
            if (cached) {
                return res.json(cached);
            }

            const vehicles = await Vehicles.findAll({
                include: [
                    { model: VehicleMarca, as: 'marca' },
                    { model: VehicleAno, as: 'ano' },
                    { model: VehicleCor, as: 'cor' },
                    { model: TipoCombustivel, as: 'tipo_combustivel' },
                    { model: Transmissao, as: 'transmissao' },
                    { model: VehicleCategories, as: 'categoria' },
                    { model: VehicleImage, as: 'images' },
                    { model: VehicleOptional, as: 'optionals', through: { attributes: [] } } // Exclude join table attributes
                ],
                order: [['modelo', 'ASC']]
            });
            
            CacheService.set(cacheKey, vehicles);
            return res.json(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a single vehicle by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicles.findByPk(id, {
                include: [
                    { model: VehicleMarca, as: 'marca' },
                    { model: VehicleAno, as: 'ano' },
                    { model: VehicleCor, as: 'cor' },
                    { model: TipoCombustivel, as: 'tipo_combustivel' },
                    { model: Transmissao, as: 'transmissao' },
                    { model: VehicleCategories, as: 'categoria' },
                    { model: VehicleImage, as: 'images' },
                    { model: VehicleOptional, as: 'optionals', through: { attributes: [] } } // Exclude join table attributes
                ]
            });
            
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            
            return res.json(vehicle);
        } catch (error) {
            console.error('Error fetching vehicle:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Create a new vehicle
    static async store(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { optionals, images = [], ...vehicleData } = req.body;

        try {
            const vehicle = await Vehicles.create(vehicleData);

            if (optionals && optionals.length > 0) {
                await (vehicle as any).setOptionals(optionals);
            }

            // Criar imagens se fornecidas
            if (Array.isArray(images) && images.length > 0) {
                await VehicleImage.bulkCreate(
                    images.map((url: string, index: number) => ({
                        vehicle_id: vehicle.id,
                        url,
                        ordem: index + 1
                    }))
                );
            }

            // Reload the instance to get the associations
            const result = await Vehicles.findByPk(vehicle.id, {
                include: [
                    { model: VehicleOptional, as: 'optionals', through: { attributes: [] } },
                    { model: VehicleImage, as: 'images' }
                ]
            });

            // Limpa cache após criar veículo
            CacheService.clearVehicleCache();

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error creating vehicle:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Update a vehicle
    static async update(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { optionals, ...vehicleData } = req.body;

        try {
            const vehicle = await Vehicles.findByPk(id);
            
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            
            await vehicle.update(vehicleData);

            if (optionals) { // Handle optional updates, including removal
                await (vehicle as any).setOptionals(optionals);
            }

            // Reload the instance to get the associations
            const result = await Vehicles.findByPk(id, {
                include: [
                    { model: VehicleMarca, as: 'marca' },
                    { model: VehicleAno, as: 'ano' },
                    { model: VehicleCor, as: 'cor' },
                    { model: VehicleCategories, as: 'categoria' },
                    { model: TipoCombustivel, as: 'tipo_combustivel' },
                    { model: Transmissao, as: 'transmissao' },
                    { model: VehicleImage, as: 'images' },
                    { model: VehicleOptional, as: 'optionals', through: { attributes: [] } }
                ]
            });
            
            // Limpa cache após atualizar veículo
            CacheService.clearVehicleCache();
            
            return res.json(result);
        } catch (error) {
            console.error('Error updating vehicle:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Search vehicles with pagination
    static async search(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, cor_id, marca_id, categoria_id, preco_min, preco_max } = req.query;
            
            const cacheKey = `vehicles:search:${JSON.stringify(req.query)}`;
            const cached = CacheService.get(cacheKey);
            
            if (cached) {
                return res.json(cached);
            }

            const where: any = {};
            if (cor_id) where.cor_id = cor_id;
            if (marca_id) where.marca_id = marca_id;
            if (categoria_id) where.categoria_id = categoria_id;

            if (preco_min && preco_max) {
                where.preco = { [Op.between]: [preco_min, preco_max] };
            } else if (preco_min) {
                where.preco = { [Op.gte]: preco_min };
            } else if (preco_max) {
                where.preco = { [Op.lte]: preco_max };
            }

            const offset = (Number(page) - 1) * Number(limit);

            const { count, rows } = await Vehicles.findAndCountAll({
                where,
                limit: Number(limit),
                offset,
                distinct: true,
                col: 'id',
                include: [
                    { model: VehicleMarca, as: 'marca' },
                    { model: VehicleAno, as: 'ano' },
                    { model: VehicleCor, as: 'cor' },
                    { model: TipoCombustivel, as: 'tipo_combustivel' },
                    { model: Transmissao, as: 'transmissao' },
                    { model: VehicleCategories, as: 'categoria' },
                    { model: VehicleImage, as: 'images' },
                    { model: VehicleOptional, as: 'optionals', through: { attributes: [] } }
                ],
                order: [['modelo', 'ASC']]
            });

            const result = {
                totalItems: count,
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                vehicles: rows
            };
            
            CacheService.set(cacheKey, result);
            return res.json(result);
        } catch (error) {
            console.error('Error searching vehicles:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete a vehicle
    static async destroy(req: Request, res: Response) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            
            // First, delete all related images
            await VehicleImage.destroy({
                where: { vehicle_id: id },
                transaction
            });
            
            // Then, delete all related optionals from the join table
            await VehicleToOptional.destroy({
                where: { vehicle_id: id },
                transaction
            });
            
            // Finally, delete the vehicle
            const deleted = await Vehicles.destroy({
                where: { id },
                transaction
            });
            
            if (!deleted) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            
            // Commit the transaction
            await transaction.commit();
            
            // Clear cache after deleting vehicle
            CacheService.clearVehicleCache();
            
            return res.status(204).send();
        } catch (error: unknown) {
            // Rollback the transaction in case of any error
            await transaction.rollback();
            console.error('Error deleting vehicle:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({ 
                error: 'Failed to delete vehicle',
                details: errorMessage
            });
        }
    }
}

export default VehicleController;
