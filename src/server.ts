import express, { Express, Request, Response } from 'express';

import Cities from './routes/cities';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Gan Basic setup');
});

const cities = new Cities();
app.get('/single', cities.getCitiesByTag);

export{app};