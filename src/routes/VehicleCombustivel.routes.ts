import { Router } from 'express';
import { body } from 'express-validator';
import VehicleTipoCombustivelController from '../controllers/VehicleTipoCombustivelController';

const router = Router();

// Validation rules
const createVehicleCombustivelRules = [
  body('nome').notEmpty().withMessage('Name is required'),
];

const updateVehicleCombustivelRules = [
  body('nome').optional().notEmpty().withMessage('Name cannot be empty'),
];

// Routes
router.get('/', VehicleTipoCombustivelController.index);
router.get('/:id', VehicleTipoCombustivelController.show);
router.post('/', createVehicleCombustivelRules, VehicleTipoCombustivelController.store);
router.put('/:id', updateVehicleCombustivelRules, VehicleTipoCombustivelController.update);
router.delete('/:id', VehicleTipoCombustivelController.destroy);

export default router;
