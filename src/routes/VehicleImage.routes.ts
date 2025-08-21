import { Router } from 'express';
import { body } from 'express-validator';
import VehicleImageController from '../controllers/VehicleImageController';

const router = Router();

// Validation rules
const createImageRules = [
  body('vehicle_id').isInt().withMessage('Vehicle ID must be an integer'),
  body('url').isURL().withMessage('URL must be a valid URL'),
  body('ordem').optional().isInt().withMessage('Order must be an integer'),
];

const updateImageRules = [
  body('url').optional().isURL().withMessage('URL must be a valid URL'),
  body('ordem').optional().isInt().withMessage('Order must be an integer'),
];

// Routes
router.get('/vehicle/:vehicle_id', VehicleImageController.index);
router.get('/:id', VehicleImageController.show);
router.post('/', createImageRules, VehicleImageController.store);
router.put('/:id', updateImageRules, VehicleImageController.update);
router.delete('/:id', VehicleImageController.destroy);

export default router;
