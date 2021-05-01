import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressPrettier from 'express-prettier';
import prettyError from 'pretty-error';

import { Bots } from '@bots';
import { C, Log } from '@commons';
import { error, request, response } from '@middlewares';
import { Telegram } from '@repositories';
import { RouterFTX } from '@routes';

import http from 'http';
import path from 'path';

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

// -- Statics
app.use('/static', express.static('assets'));

// app.use(express.static(path.join(__dirname, 'assets')));

// -- Endpoints
log.text('Loading endpoints...');
app.use('/ftx', RouterFTX);
app.get('/', (req, res) => res.json(C));

// app.get('/*', (req, res) => {
//   console.log('>>>', path.join(__dirname + '/../assets/client.html'));
//   res.sendFile(path.join(__dirname + '/../assets/client.html'));
// });

app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  log.succeed(`Up & Ready on port ${listener.address().port}.`);

  // Telegram.message(`Up & Ready on port ${listener.address().port}.`);
  Bots.start();
});

process.on('uncaughtException', () => server.close());

process.on('unhandledRejection', (error, promise) => {
  // @TODO console.log(`Rejected Promise: ${promise} with error ${error}`);
});
