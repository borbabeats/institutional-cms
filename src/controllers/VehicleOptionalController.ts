import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import VehicleOptional from '../models/VehicleOptional';

export const getVehicleOptionals = async (_req: Request, res: Response) => {
  try {
    const optionals = await VehicleOptional.findAll();
    return res.json(optionals);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching vehicle optionals', error });
  }
};

export const getVehicleOptionalById = async (req: Request, res: Response) => {
  try {
    const optional = await VehicleOptional.findByPk(req.params.id);
    if (optional) {
      return res.json(optional);
    } else {
      return res.status(404).json({ message: 'Vehicle optional not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching vehicle optional', error });
  }
};

export const createVehicleOptional = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const optional = await VehicleOptional.create(req.body);
    return res.status(201).json(optional);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating vehicle optional', error });
  }
};

export const updateVehicleOptional = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const optional = await VehicleOptional.findByPk(req.params.id);
    if (optional) {
      await optional.update(req.body);
      return res.json(optional);
    } else {
      return res.status(404).json({ message: 'Vehicle optional not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error updating vehicle optional', error });
  }
};

export const deleteVehicleOptional = async (req: Request, res: Response) => {
  try {
    const optional = await VehicleOptional.findByPk(req.params.id);
    if (optional) {
      await optional.destroy();
      return res.json({ message: 'Vehicle optional deleted' });
    } else {
      return res.status(404).json({ message: 'Vehicle optional not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting vehicle optional', error });
  }
};
