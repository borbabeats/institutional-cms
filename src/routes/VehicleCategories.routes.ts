import { Router } from 'express';
import { body } from 'express-validator';
import VehicleCategoriesController from '../controllers/VehicleCategoriesController';

const router = Router();

// Validation rules
const createVehicleCategoriesRules = [
  body('nome').notEmpty().withMessage('Name is required'),
  body('descricao').optional().notEmpty().withMessage('Description cannot be empty'),
];

const updateVehicleCategoriesRules = [
  body('nome').optional().notEmpty().withMessage('Name cannot be empty'),
  body('descricao').optional().notEmpty().withMessage('Description cannot be empty'),
];

// Routes
router.get('/', VehicleCategoriesController.index);
router.get('/:id', VehicleCategoriesController.show);
router.post('/', createVehicleCategoriesRules, VehicleCategoriesController.store);
router.put('/:id', updateVehicleCategoriesRules, VehicleCategoriesController.update);
router.delete('/:id', VehicleCategoriesController.destroy);

export default router;
