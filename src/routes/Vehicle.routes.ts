import { Router } from 'express';
import { body } from 'express-validator';
import VehicleController from '../controllers/VehicleController';

const router = Router();

// Validation rules
const createVehicleRules = [
  body('modelo').notEmpty().withMessage('Model is required'),
  body('preco').isDecimal().withMessage('Price must be a decimal'),
  body('quilometragem').isInt().withMessage('Mileage must be an integer'),
  body('tipo_combustivel').notEmpty().withMessage('Fuel type is required'),
  body('transmissao').notEmpty().withMessage('Transmission is required'),
];

const updateVehicleRules = [
  body('modelo').optional().notEmpty().withMessage('Model cannot be empty'),
  body('preco').optional().isDecimal().withMessage('Price must be a decimal'),
  body('quilometragem').optional().isInt().withMessage('Mileage must be an integer'),
  body('tipo_combustivel').optional().notEmpty().withMessage('Fuel type cannot be empty'),
  body('transmissao').optional().notEmpty().withMessage('Transmission cannot be empty'),
];

// Routes
router.get('/', VehicleController.index);
router.get('/:id', VehicleController.show);
router.post('/', createVehicleRules, VehicleController.store);
router.put('/:id', updateVehicleRules, VehicleController.update);
router.delete('/:id', VehicleController.destroy);

export default router;
