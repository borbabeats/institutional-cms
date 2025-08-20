import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleMarca from '../models/VehicleMarca';

class VehicleMarcaController {
    //Get all colors
    static async index(_req: Request, res: Response) {
        try {
            const vehicleMarca = await VehicleMarca.findAll({
                order: [['nome', 'ASC']]
            });
            return res.json(vehicleMarca);
        } catch (error) {
            console.error('Error fetching vehicleMarca:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single color by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleMarca = await VehicleMarca.findByPk(id);
            
            if (!vehicleMarca) {
                return res.status(404).json({ error: 'VehicleMarca not found' });
            }
            
            return res.json(vehicleMarca);
        } catch (error) {
            console.error('Error fetching vehicleMarca:', error);
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
            const vehicleMarca = await VehicleMarca.create({ nome });
            return res.status(201).json(vehicleMarca);
        } catch (error) {
            console.error('Error creating vehicleMarca:', error);
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
            const vehicleMarca = await VehicleMarca.findByPk(id);
            
            if (!vehicleMarca) {
                return res.status(404).json({ error: 'VehicleMarca not found' });
            }
            
            await vehicleMarca.update({ nome });
            return res.json(vehicleMarca);
        } catch (error) {
            console.error('Error updating vehicleMarca:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a color
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleMarca = await VehicleMarca.findByPk(id);
            
            if (!vehicleMarca) {
                return res.status(404).json({ error: 'VehicleMarca not found' });
            }
            
            await vehicleMarca.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleMarca:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleMarcaController;
