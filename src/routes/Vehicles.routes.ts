import { Router } from 'express';
import { body } from 'express-validator';
import VehicleController from '../controllers/VehicleController';

const router = Router();

// Validation rules
const createVehicleRules = [
  body('modelo').notEmpty().withMessage('Model is required'),
  body('preco').isDecimal().withMessage('Price must be a decimal'),
  body('quilometragem').isInt().withMessage('Mileage must be an integer'),
  body('tipo_combustivel_id').notEmpty().withMessage('Fuel type ID is required'),
  body('transmissao_id').notEmpty().withMessage('Transmission ID is required'),
  body('imagem_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  body('disponivel').optional().isBoolean().withMessage('Availability must be a boolean'),
  body('marca_id').optional().isInt().withMessage('Marca ID must be an integer'),
  body('ano_id').optional().isInt().withMessage('Ano ID must be an integer'),
  body('cor_id').optional().isInt().withMessage('Cor ID must be an integer'),
  body('categoria_id').optional().isInt().withMessage('Categoria ID must be an integer'),
];

const updateVehicleRules = [
  body('modelo').optional().notEmpty().withMessage('Model cannot be empty'),
  body('preco').optional().isDecimal().withMessage('Price must be a decimal'),
  body('quilometragem').optional().isInt().withMessage('Mileage must be an integer'),
  body('tipo_combustivel_id').optional().notEmpty().withMessage('Fuel type ID cannot be empty'),
  body('transmissao_id').optional().notEmpty().withMessage('Transmission ID cannot be empty'),
  body('imagem_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  body('disponivel').optional().isBoolean().withMessage('Availability must be a boolean'),
  body('marca_id').optional().isInt().withMessage('Marca ID must be an integer'),
  body('ano_id').optional().isInt().withMessage('Ano ID must be an integer'),
  body('cor_id').optional().isInt().withMessage('Cor ID must be an integer'),
  body('categoria_id').optional().isInt().withMessage('Categoria ID must be an integer'),
];



// Routes
router.get('/', VehicleController.index);
router.get('/search', VehicleController.search);
router.get('/:id', VehicleController.show);
router.post('/', createVehicleRules, VehicleController.store);
router.put('/:id', updateVehicleRules, VehicleController.update);
router.delete('/:id', VehicleController.destroy);

export default router;
