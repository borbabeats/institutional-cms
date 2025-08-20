import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Vehicles from '../models/Vehicles';

class VehicleController {
    // Get all vehicles
    static async index(_req: Request, res: Response) {
        try {
            const vehicles = await Vehicles.findAll({
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
            const vehicle = await Vehicles.findByPk(id);
            
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

        try {
            const vehicle = await Vehicles.create(req.body);
            return res.status(201).json(vehicle);
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

        try {
            const { id } = req.params;
            const vehicle = await Vehicles.findByPk(id);
            
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            
            await vehicle.update(req.body);
            return res.json(vehicle);
        } catch (error) {
            console.error('Error updating vehicle:', error);
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
