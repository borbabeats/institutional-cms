import { Router } from 'express';
import { body } from 'express-validator';
import VehicleMarcaController from '../controllers/VehicleMarcaController';

const router = Router();

// Validation rules
const createVehicleMarcaRules = [
  body('nome').notEmpty().withMessage('Name is required'),
];

const updateVehicleMarcaRules = [
  body('nome').optional().notEmpty().withMessage('Name cannot be empty'),
];

// Routes
router.get('/', VehicleMarcaController.index);
router.get('/:id', VehicleMarcaController.show);
router.post('/', createVehicleMarcaRules, VehicleMarcaController.store);
router.put('/:id', updateVehicleMarcaRules, VehicleMarcaController.update);
router.delete('/:id', VehicleMarcaController.destroy);

export default router;
