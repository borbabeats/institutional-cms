import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleCor from '../models/VehicleCor';

class VehicleCorController {
    //Get all colors
    static async index(_req: Request, res: Response) {
        try {
            const vehicleCor = await VehicleCor.findAll({
                order: [['nome', 'ASC']]
            });
            return res.json(vehicleCor);
        } catch (error) {
            console.error('Error fetching vehicleCor:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single color by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleCor = await VehicleCor.findByPk(id);
            
            if (!vehicleCor) {
                return res.status(404).json({ error: 'VehicleCor not found' });
            }
            
            return res.json(vehicleCor);
        } catch (error) {
            console.error('Error fetching vehicleCor:', error);
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
            const { nome } = req.body;
            const vehicleCor = await VehicleCor.create({ nome });
            return res.status(201).json(vehicleCor);
        } catch (error) {
            console.error('Error creating vehicleCor:', error);
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
            const { nome } = req.body;
            const vehicleCor = await VehicleCor.findByPk(id);
            
            if (!vehicleCor) {
                return res.status(404).json({ error: 'VehicleCor not found' });
            }
            
            await vehicleCor.update({ nome });
            return res.json(vehicleCor);
        } catch (error) {
            console.error('Error updating vehicleCor:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a color
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleCor = await VehicleCor.findByPk(id);
            
            if (!vehicleCor) {
                return res.status(404).json({ error: 'VehicleCor not found' });
            }
            
            await vehicleCor.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleCor:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleCorController;
