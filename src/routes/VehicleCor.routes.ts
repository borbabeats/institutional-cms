import { Router } from 'express';
import { body } from 'express-validator';
import VehicleCorController from '../controllers/VehicleCorController';

const router = Router();

// Validation rules
const createVehicleCorRules = [
  body('nome').notEmpty().withMessage('Name is required'),
];

const updateVehicleCorRules = [
  body('nome').optional().notEmpty().withMessage('Name cannot be empty'),
];

// Routes
router.get('/', VehicleCorController.index);
router.get('/:id', VehicleCorController.show);
router.post('/', createVehicleCorRules, VehicleCorController.store);
router.put('/:id', updateVehicleCorRules, VehicleCorController.update);
router.delete('/:id', VehicleCorController.destroy);

export default router;
