import express, { Express, Request, Response } from 'express';

import { requireAuth } from './middleware/auth';
import Cities from './routes/cities';

const app: Express = express();

// Public endpoint for healthcheck
app.get('/', (req: Request, res: Response) => {
  res.send('Gan Basic setup');
});

// Applying auth middleware, all routes now require auth
app.use(requireAuth);

const cities = new Cities();
app.get('/cities-by-tag', cities.getCitiesByTag);
app.get('/distance', cities.getDistance);
app.get('/area', cities.getArea);
app.get('/area-result/:guid', cities.getAreaResult);
app.get('/all-cities', cities.getAllCities);

export{ app };