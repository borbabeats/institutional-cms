import { Router } from 'express';
import { body, param, query } from 'express-validator';
import PostController from '../controllers/PostController';

const router = Router();

// Validation middleware
const createPostRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author_id').isInt().withMessage('Author ID must be an integer'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status value'),
];

const updatePostRules = [
  param('id').isInt().withMessage('Invalid post ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status value'),
  body('author_id').optional().isInt().withMessage('Author ID must be an integer'),
];

const getPostsRules = [
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status value'),
  query('author_id').optional().isInt().withMessage('Author ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// Routes
router.get('/', getPostsRules, PostController.index);
router.get('/:id', PostController.show);
router.post('/', createPostRules, PostController.store);
router.put('/:id', updatePostRules, PostController.update);
router.delete('/:id', 
  param('id').isInt().withMessage('Invalid post ID'),
  PostController.destroy
);

export default router;
