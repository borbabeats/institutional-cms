import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Category from '../models/Category';
import Post from '../models/Post';

class CategoryController {
  // Get all categories
  static async index(_req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']]
      });
      return res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a single category by ID or slug
  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const isNumericId = /^\d+$/.test(id);
      
      const category = await Category.findOne({
        where: isNumericId ? { id: parseInt(id, 10) } : { slug: id },
        include: [
          {
            model: (await import('../models/Post')).default,
            as: 'posts',
            attributes: ['id', 'title', 'slug', 'excerpt', 'created_at'],
            where: { status: 'published' },
            required: false
          }
        ]
      });
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new category
  static async store(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description } = req.body;
      
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      const category = await Category.create({
        id: 0, // Será substituído pelo auto-incremento
        name,
        slug,
        description,
        created_at: new Date(),
        updated_at: new Date(),
      } as any); // Usando 'as any' temporariamente para evitar problemas de tipagem
      
      return res.status(201).json(category);
    } catch (error: any) {
      console.error('Error creating category:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Category with this name or slug already exists' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a category
  static async update(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const category = await Category.findByPk(parseInt(id, 10));
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Update slug if name changed
      if (name && name !== category.name) {
        const slug = name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-');
        
        category.slug = slug;
        category.name = name;
      }
      
      if (description !== undefined) {
        category.description = description;
      }
      
      await category.save();
      
      return res.json(category);
    } catch (error: any) {
      console.error('Error updating category:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Category with this name or slug already exists' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a category
  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(parseInt(id, 10));
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Check if category is being used by any posts
      const postsCount = await Post.count({
        where: { category_id: category.id }
      });
      
      if (postsCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with associated posts',
          postsCount
        });
      }
      
      await category.destroy();
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default CategoryController;
