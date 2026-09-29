import { Router, Request, Response } from 'express';
import { newsService } from '../services/newsService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const news = await newsService.getLatestNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const article = await newsService.getNewsById(id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

router.post('/fetch/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker;
    const result = await newsService.fetchNewsForTicker(ticker);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch news for ${req.params.ticker}: ${error.message}` });
  }
});

router.post('/fetch-all', async (req: Request, res: Response) => {
  try {
    const result = await newsService.fetchAllNews();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch all news: ${error.message}` });
  }
});

export default router;
