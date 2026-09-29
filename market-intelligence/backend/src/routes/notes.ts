import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { news_id, content } = req.body;
    if (!news_id || !content) {
      return res.status(400).json({ error: 'news_id and content are required' });
    }

    const db = getDb();
    db.run(
      'INSERT INTO notes (news_id, content) VALUES (?, ?)',
      [news_id, content]
    );
    saveDb();
    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const db = getDb();
    db.run(
      'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, id]
    );
    saveDb();
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

export default router;
