import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import Vehicles from '../models/Vehicles';
import VehicleMarca from '../models/VehicleMarca';
import VehicleAno from '../models/VehicleAno';
import VehicleCor from '../models/VehicleCor';
import TipoCombustivel from '../models/VehicleTipoCombustivel';
import Transmissao from '../models/VehicleTransmissao';
import VehicleCategories from '../models/VehicleCategories';
import VehicleImage from '../models/VehicleImage';
import VehicleOptional from '../models/VehicleOptional';

class VehicleController {
    // Get all vehicles
    static async index(_req: Request, res: Response) {
        try {
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

        const { optionals, ...vehicleData } = req.body;

        try {
            const vehicle = await Vehicles.create(vehicleData);

            if (optionals && optionals.length > 0) {
                await (vehicle as any).setOptionals(optionals);
            }

            // Reload the instance to get the associations
            const result = await Vehicles.findByPk(vehicle.id, {
                include: [{ model: VehicleOptional, as: 'optionals', through: { attributes: [] } }]
            });

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
            
            return res.json(result);
        } catch (error) {
            console.error('Error updating vehicle:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Delete a vehicle
    static async search(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, cor_id, marca_id, categoria_id, preco_min, preco_max } = req.query;

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

            return res.json({
                totalItems: count,
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                vehicles: rows
            });
        } catch (error) {
            console.error('Error searching vehicles:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete a vehicle
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicles.findByPk(id);
            
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            
            await vehicle.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleController;
