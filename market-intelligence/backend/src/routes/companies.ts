import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db';
import { Company } from '../types';
import { newsService } from '../services/newsService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const result = db.exec('SELECT * FROM companies ORDER BY name ASC');
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      const companies = values.map(val => {
        const obj: any = {};
        columns.forEach((col, index) => {
          obj[col] = val[index];
        });
        return obj;
      });
      res.json(companies);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { name, ticker, sector } = req.body;
    if (!name || !ticker || !sector) {
      return res.status(400).json({ error: 'Name, ticker, and sector are required' });
    }

    const db = getDb();
    db.run(
      'INSERT INTO companies (name, ticker, sector) VALUES (?, ?, ?)',
      [name, ticker, sector]
    );
    saveDb();
    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, ticker, sector } = req.body;
    if (!name || !ticker || !sector) {
      return res.status(400).json({ error: 'Name, ticker, and sector are required' });
    }

    const db = getDb();
    db.run(
      'UPDATE companies SET name = ?, ticker = ?, sector = ? WHERE id = ?',
      [name, ticker, sector, id]
    );
    saveDb();
    res.json({ message: 'Company updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const db = getDb();
    db.run('DELETE FROM companies WHERE id = ?', [id]);
    saveDb();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

router.get('/:id/news', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const db = getDb();
    const result = db.exec('SELECT ticker FROM companies WHERE id = ?', [id]);

    if (result.length > 0) {
      const ticker = result[0].values[0][0] as string;
      const news = await newsService.getCompanyNews(ticker);
      res.json(news);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company news' });
  }
});

export default router;
