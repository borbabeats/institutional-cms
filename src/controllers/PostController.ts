import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post, { PostCreationAttributes } from '../models/Post';
import Author from '../models/Author';

class PostController {
  // Get all posts with optional filtering and pagination
  static async index(req: Request, res: Response) {
    try {
      const { status, author_id, slug, category_id, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      const where: any = {};
      if (status) where.status = status;
      if (author_id) where.author_id = author_id;
      if (slug) where.slug = slug;
      if (category_id) where.category_id = category_id;

      const { count, rows: posts } = await Post.findAndCountAll({
        where,
        include: [
          {
            model: Author,
            as: 'author',
            attributes: ['id', 'name', 'email']
          },
          {
            model: (await import('../models/Category')).default,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ],
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
      const isNumericId = /^\d+$/.test(id);
      
      const post = await Post.findOne({
        where: isNumericId ? { id: parseInt(id, 10) } : { slug: id },
        include: [
          {
            model: Author,
            as: 'author',
            attributes: ['id', 'name', 'email']
          },
          {
            model: (await import('../models/Category')).default,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ]
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
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const { 
        title, 
        content, 
        author_id, 
        category_id = 1, 
        status = 'draft', 
        excerpt, 
        image_url 
      } = req.body;
      
      console.log('Extracted image_url:', image_url);
      
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
        excerpt, // Pode ser undefined, o hook beforeSave irá gerar se necessário
        author_id,
        category_id: parseInt(category_id, 10) || 1, // Default para a primeira categoria
        status,
        image_url: image_url || null // Força para null se for undefined
      };
      
      console.log('Post data before create:', JSON.stringify(postData, null, 2));
      
      const post = await Post.create(postData);
      
      // Busca o post novamente para garantir que temos os dados mais recentes
      const savedPost = await Post.findByPk(post.id, {
        raw: true
      });
      
      console.log('Saved post from database:', JSON.stringify(savedPost, null, 2));
      
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
      const { title, content, status, author_id, image_url } = req.body;
      
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
      if (content) {
        post.content = content;
        // Se o conteúdo mudou, o excerpt será atualizado automaticamente pelo hook beforeSave
      }
      if (status) post.status = status;
      if (author_id) post.author_id = author_id;
      // Atualiza a URL da imagem se fornecida
      if (image_url !== undefined) post.image_url = image_url;
      // Se um excerpt for fornecido explicitamente, ele será usado
      // Caso contrário, o hook beforeSave irá gerar um a partir do conteúdo
      if (req.body.excerpt !== undefined) {
        post.excerpt = req.body.excerpt;
      }
      
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