import express from 'express';
import cors from 'cors';
import companiesRouter from './routes/companies';
import newsRouter from './routes/news';
import notesRouter from './routes/notes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/companies', companiesRouter);
app.use('/api/news', newsRouter);
app.use('/api/notes', notesRouter);

export default app;
