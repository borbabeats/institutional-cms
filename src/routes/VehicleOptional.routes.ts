import { Router } from 'express';
import { body } from 'express-validator';
import {
  getVehicleOptionals,
  getVehicleOptionalById,
  createVehicleOptional,
  updateVehicleOptional,
  deleteVehicleOptional,
} from '../controllers/VehicleOptionalController';

const router = Router();

router.get('/', getVehicleOptionals);
router.get('/:id', getVehicleOptionalById);
router.post(
  '/',
  [body('name').notEmpty().withMessage('Name is required')],
  createVehicleOptional
);
router.put(
  '/:id',
  [body('name').notEmpty().withMessage('Name is required')],
  updateVehicleOptional
);
router.delete('/:id', deleteVehicleOptional);

export default router;
