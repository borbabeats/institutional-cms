import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleCategories from '../models/VehicleCategories';

class VehicleCategoriesController {
    //Get all colors
    static async index(_req: Request, res: Response) {
        try {
            const vehicleCategories = await VehicleCategories.findAll({
                order: [['nome', 'ASC']]
            });
            return res.json(vehicleCategories);
        } catch (error) {
            console.error('Error fetching vehicleCategories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single color by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleCategories = await VehicleCategories.findByPk(id);
            
            if (!vehicleCategories) {
                return res.status(404).json({ error: 'VehicleCategories not found' });
            }
            
            return res.json(vehicleCategories);
        } catch (error) {
            console.error('Error fetching vehicleCategories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Create a new color
    static async store(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nome, descricao } = req.body;
            const vehicleCategories = await VehicleCategories.create({ nome, descricao });
            return res.status(201).json(vehicleCategories);
        } catch (error) {
            console.error('Error creating vehicleCategories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Update a color
    static async update(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;
            const vehicleCategories = await VehicleCategories.findByPk(id);
            
            if (!vehicleCategories) {
                return res.status(404).json({ error: 'VehicleCategories not found' });
            }
            
            await vehicleCategories.update({ nome, descricao });
            return res.json(vehicleCategories);
        } catch (error) {
            console.error('Error updating vehicleCategories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a color
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleCategories = await VehicleCategories.findByPk(id);
            
            if (!vehicleCategories) {
                return res.status(404).json({ error: 'VehicleCategories not found' });
            }
            
            await vehicleCategories.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleCategories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleCategoriesController;
