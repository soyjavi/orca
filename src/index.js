import http from 'http';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressPrettier from 'express-prettier';
import prettyError from 'pretty-error';

import { C, Log } from '@commons';
import { error, request, response } from '@middlewares';
import { RouterFTX } from '@routes';

import { BuyBitcoin } from '@bots';

dotenv.config();
prettyError.start();
const log = new Log(C.INSTANCE, 'Starting...');

const { PORT = 3000 } = process.env;
const app = express();
const server = http.createServer(app);

// -- Middlewares
log.text('Loading middlewares...');
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({}));
app.use(compression());
app.use(expressPrettier({ alwaysOn: true, fallbackOnError: false }));
app.use(request);

// -- Endpoints
log.text('Loading endpoints...');
app.get('/', (req, res) => res.json(C));
app.use('/ftx', RouterFTX);
app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  log.succeed(`Up & Ready on port ${listener.address().port}.`);

  BuyBitcoin();

  BuyBitcoin({
    fromCoin: 'XRP',
    minValue: 1000,
  });
});

process.on('uncaughtException', () => server.close());

process.on('unhandledRejection', (error, promise) => {
  // @TODO console.log(`Rejected Promise: ${promise} with error ${error}`);
});
