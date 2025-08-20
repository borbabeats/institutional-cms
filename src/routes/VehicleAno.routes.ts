import { Router } from 'express';
import { body } from 'express-validator';
import VehicleAnoController from '../controllers/VehicleAnoController';

const router = Router();

// Validation rules
const createVehicleAnoRules = [
  body('ano').notEmpty().withMessage('Name is required'),
];

const updateVehicleAnoRules = [
  body('ano').optional().notEmpty().withMessage('Name cannot be empty'),
];

// Routes
router.get('/', VehicleAnoController.index);
router.get('/:id', VehicleAnoController.show);
router.post('/', createVehicleAnoRules, VehicleAnoController.store);
router.put('/:id', updateVehicleAnoRules, VehicleAnoController.update);
router.delete('/:id', VehicleAnoController.destroy);

export default router;
