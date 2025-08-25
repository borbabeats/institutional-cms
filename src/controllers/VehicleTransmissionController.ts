import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Transmissao from '../models/VehicleTransmissao';

class VehicleTransmissionController {
    //Get all transmissões
    static async index(_req: Request, res: Response) {
        try {
            const vehicleTransmission = await Transmissao.findAll({
                order: [['tipo', 'ASC']]
            });
            return res.json(vehicleTransmission);
        } catch (error) {
            console.error('Error fetching vehicleTransmission:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    //Get a single transmissão by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleTransmission = await Transmissao.findByPk(id);
            
            if (!vehicleTransmission) {
                return res.status(404).json({ error: 'VehicleTransmission not found' });
            }
            
            return res.json(vehicleTransmission);
        } catch (error) {
            console.error('Error fetching vehicleTransmission:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Create a new transmissão
    static async store(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { tipo } = req.body;
            const vehicleTransmission = await Transmissao.create({ tipo });
            return res.status(201).json(vehicleTransmission);
        } catch (error) {
            console.error('Error creating vehicleTransmission:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Update a transmissão
    static async update(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { tipo } = req.body;
            const vehicleTransmission = await Transmissao.findByPk(id);
            
            if (!vehicleTransmission) {
                return res.status(404).json({ error: 'VehicleTransmission not found' });
            }
            
            await vehicleTransmission.update({ tipo });
            return res.json(vehicleTransmission);
        } catch (error) {
            console.error('Error updating vehicleTransmission:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    //Delete a transmissão
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicleTransmission = await Transmissao.findByPk(id);
            
            if (!vehicleTransmission) {
                return res.status(404).json({ error: 'VehicleTransmission not found' });
            }
            
            await vehicleTransmission.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicleTransmission:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleTransmissionController;
