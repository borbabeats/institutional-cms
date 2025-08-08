import { Router } from 'express';
import { body, param, query } from 'express-validator';
import CategoryController from '../controllers/CategoryController';

const router = Router();

// Validation middleware
const createCategoryRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

const updateCategoryRules = [
  param('id').isInt().withMessage('Invalid category ID'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

// Routes
// List all categories
router.get(
  '/categories',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  CategoryController.index
);

// Get single category by ID or slug
router.get(
  '/categories/:id',
  [
    param('id').notEmpty().withMessage('Category ID or slug is required'),
  ],
  CategoryController.show
);

// Create new category
router.post(
  '/categories',
  createCategoryRules,
  CategoryController.store
);

// Update category
router.put(
  '/categories/:id',
  updateCategoryRules,
  CategoryController.update
);

// Delete category
router.delete(
  '/categories/:id',
  [
    param('id').isInt().withMessage('Invalid category ID'),
  ],
  CategoryController.destroy
);

export default router;
