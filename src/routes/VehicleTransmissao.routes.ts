import { Router } from 'express';
import { body } from 'express-validator';
import VehicleTransmissionController from '../controllers/VehicleTransmissionController';

const router = Router();

// Validation rules
const createVehicleTransmissionRules = [
  body('nome').notEmpty().withMessage('Name is required'),
];

const updateVehicleTransmissionRules = [
  body('nome').optional().notEmpty().withMessage('Name cannot be empty'),
];

// Routes
router.get('/', VehicleTransmissionController.index);
router.get('/:id', VehicleTransmissionController.show);
router.post('/', createVehicleTransmissionRules, VehicleTransmissionController.store);
router.put('/:id', updateVehicleTransmissionRules, VehicleTransmissionController.update);
router.delete('/:id', VehicleTransmissionController.destroy);

export default router;
