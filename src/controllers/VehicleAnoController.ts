import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleAno from '../models/VehicleAno';

class VehicleAnoController {
    //Get all colors
    static async index(_req: Request, res: Response) {
        try {
            const vehicleAno = await VehicleAno.findAll({
                order: [['ano', 'ASC']]
            });
            return res.json(vehicleAno);
        } catch (error) {
            console.error('Error fetching vehicleAno:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single color by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleAno = await VehicleAno.findByPk(id);
            
            if (!vehicleAno) {
                return res.status(404).json({ error: 'VehicleAno not found' });
            }
            
            return res.json(vehicleAno);
        } catch (error) {
            console.error('Error fetching vehicleAno:', error);
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
            const { ano } = req.body;
            const vehicleAno = await VehicleAno.create({ ano });
            return res.status(201).json(vehicleAno);
        } catch (error) {
            console.error('Error creating vehicleAno:', error);
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
            const { ano } = req.body;
            const vehicleAno = await VehicleAno.findByPk(id);
            
            if (!vehicleAno) {
                return res.status(404).json({ error: 'VehicleAno not found' });
            }
            
            await vehicleAno.update({ ano });
            return res.json(vehicleAno);
        } catch (error) {
            console.error('Error updating vehicleAno:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a color
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleAno = await VehicleAno.findByPk(id);
            
            if (!vehicleAno) {
                return res.status(404).json({ error: 'VehicleAno not found' });
            }
            
            await vehicleAno.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleAno:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleAnoController;
