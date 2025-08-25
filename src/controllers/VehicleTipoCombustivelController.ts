import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TipoCombustivel from '../models/VehicleTipoCombustivel';

class VehicleTipoCombustivelController {
    //Get all combustiveis
    static async index(_req: Request, res: Response) {
        try {
            const vehicleTipoCombustivel = await TipoCombustivel.findAll({
                order: [['nome', 'ASC']]
            });
            return res.json(vehicleTipoCombustivel);
        } catch (error) {
            console.error('Error fetching vehicleTipoCombustivel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single combustivel by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleTipoCombustivel = await TipoCombustivel.findByPk(id);
            
            if (!vehicleTipoCombustivel) {
                return res.status(404).json({ error: 'VehicleTipoCombustivel not found' });
            }
            
            return res.json(vehicleTipoCombustivel);
        } catch (error) {
            console.error('Error fetching vehicleTipoCombustivel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Create a new combustivel
    static async store(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nome } = req.body;
            const vehicleTipoCombustivel = await TipoCombustivel.create({ nome });
            return res.status(201).json(vehicleTipoCombustivel);
        } catch (error) {
            console.error('Error creating vehicleTipoCombustivel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Update a combustivel
    static async update(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { nome } = req.body;
            const vehicleTipoCombustivel = await TipoCombustivel.findByPk(id);
            
            if (!vehicleTipoCombustivel) {
                return res.status(404).json({ error: 'VehicleTipoCombustivel not found' });
            }
            
            await vehicleTipoCombustivel.update({ nome });
            return res.json(vehicleTipoCombustivel);
        } catch (error) {
            console.error('Error updating vehicleTipoCombustivel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a combustivel
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleTipoCombustivel = await TipoCombustivel.findByPk(id);
            
            if (!vehicleTipoCombustivel) {
                return res.status(404).json({ error: 'VehicleTipoCombustivel not found' });
            }
            
            await vehicleTipoCombustivel.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleTipoCombustivel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleTipoCombustivelController;
