import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleImage from '../models/VehicleImage';

class VehicleImageController {
    // Get all images for a specific vehicle
    static async index(req: Request, res: Response) {
        try {
            const { vehicle_id } = req.params;
            const images = await VehicleImage.findAll({
                where: { vehicle_id },
                order: [['ordem', 'ASC']]
            });
            return res.json(images);
        } catch (error) {
            console.error('Error fetching vehicle images:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a single image by ID
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const image = await VehicleImage.findByPk(id);
            
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            
            return res.json(image);
        } catch (error) {
            console.error('Error fetching vehicle image:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Create a new image
    static async store(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { vehicle_id, url, ordem } = req.body;
            const image = await VehicleImage.create({ vehicle_id, url, ordem });
            return res.status(201).json(image);
        } catch (error) {
            console.error('Error creating vehicle image:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Update an image
    static async update(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { url, ordem } = req.body;
            const image = await VehicleImage.findByPk(id);
            
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            
            await image.update({ url, ordem });
            return res.json(image);
        } catch (error) {
            console.error('Error updating vehicle image:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        
    // Delete an image
    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const image = await VehicleImage.findByPk(id);
            
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            
            await image.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting vehicle image:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default VehicleImageController;
