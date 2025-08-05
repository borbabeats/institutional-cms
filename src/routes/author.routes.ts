import { Router } from 'express';
import { body } from 'express-validator';
import AuthorController from '../controllers/AuthorController';

const router = Router();

// Validation rules
const createAuthorRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];

const updateAuthorRules = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];

// Routes
router.get('/', AuthorController.index);
router.get('/:id', AuthorController.show);
router.post('/', createAuthorRules, AuthorController.store);
router.put('/:id', updateAuthorRules, AuthorController.update);
router.delete('/:id', AuthorController.destroy);

export default router;
