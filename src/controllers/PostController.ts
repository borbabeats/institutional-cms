import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post, { PostCreationAttributes } from '../models/Post';
import Author from '../models/Author';

class PostController {
  // Get all posts with optional filtering and pagination
  static async index(req: Request, res: Response) {
    try {
      const { status, author_id, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      const where: any = {};
      if (status) where.status = status;
      if (author_id) where.author_id = author_id;

      const { count, rows: posts } = await Post.findAndCountAll({
        where,
        include: [{
          model: Author,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      return res.json({
        data: posts,
        meta: {
          total: count,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a single post by ID or slug
  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const isNumericId = !isNaN(Number(id));
      
      const where: any = isNumericId ? { id } : { slug: id };
      
      const post = await Post.findOne({
        where,
        include: [{
          model: Author,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      return res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new post
  static async store(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, author_id, status = 'draft' } = req.body;
      
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      const postData: PostCreationAttributes = {
        title,
        slug,
        content,
        author_id,
        status
      };
      
      const post = await Post.create(postData);
      return res.status(201).json(post);
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Slug must be unique' });
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: 'Invalid author_id' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a post
  static async update(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, content, status, author_id } = req.body;
      
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Update fields if provided
      if (title) {
        post.title = title;
        // Update slug if title changes
        post.slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-');
      }
      if (content) post.content = content;
      if (status) post.status = status;
      if (author_id) post.author_id = author_id;
      
      await post.save();
      return res.json(post);
    } catch (error: any) {
      console.error('Error updating post:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Slug must be unique' });
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: 'Invalid author_id' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a post
  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      await post.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default PostController;