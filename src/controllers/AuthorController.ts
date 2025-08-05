import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Author from '../models/Author';

class AuthorController {
  // Get all authors
  static async index(_req: Request, res: Response) {
    try {
      const authors = await Author.findAll();
      return res.json(authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a single author by ID
  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await Author.findByPk(id);
      
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      return res.json(author);
    } catch (error) {
      console.error('Error fetching author:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new author
  static async store(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email } = req.body;
      const author = await Author.create({ name, email });
      return res.status(201).json(author);
    } catch (error) {
      console.error('Error creating author:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update an author
  static async update(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      const author = await Author.findByPk(id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      await author.update({ name, email });
      return res.json(author);
    } catch (error) {
      console.error('Error updating author:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete an author
  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await Author.findByPk(id);
      
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      await author.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting author:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AuthorController;
