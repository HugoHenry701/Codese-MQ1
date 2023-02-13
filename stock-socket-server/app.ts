import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import logger from 'morgan';

//routes

import { chartDataRouter } from '../src/routes/chart-data.route';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(logger('dev', {}));

//api

app.use(chartDataRouter);

app.all('*', async (req, res) => {
  res.send({
    response_status: 0,
    message: 'API NOT FOUND',
  });
});

export { app };
