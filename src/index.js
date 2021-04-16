import http from 'http';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressPrettier from 'express-prettier';
import prettyError from 'pretty-error';

import PKG from '../package.json';
import { error, request, response } from '@middlewares';
import { RouterFTX } from '@routes';

dotenv.config();
prettyError.start();

const { PORT = 3000, INSTANCE } = process.env;
const app = express();
const server = http.createServer(app);

// -- Middlewares
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({}));
app.use(compression());
app.use(expressPrettier({ alwaysOn: true, fallbackOnError: false }));
app.use(request);

// -- Endpoints
app.get('/', (req, res) => res.json(PKG));
app.use('/ftx', RouterFTX);
app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  console.log(`🦈 ORCA v${PKG.version} ${INSTANCE}:${listener.address().port}...`);
});

process.on('uncaughtException', () => server.close());
