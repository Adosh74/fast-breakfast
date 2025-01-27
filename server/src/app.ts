import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { NotFound } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { requestLoggerMiddleware } from './middlewares/request-logger';
import { routes } from './routes';
import { serverEnv } from './config';
import path from 'path';

const app = express();

app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: serverEnv.nodeEnv === 'production',
	})
);

if (serverEnv.nodeEnv !== 'test') {
	app.use(requestLoggerMiddleware);
}

if (serverEnv.nodeEnv === 'production') {
	app.use(express.static(path.join(__dirname, '../../client/dist')));
}

app.use('/api', routes);

// app.all('*', () => {
// 	throw new NotFound();
// });

app.use(errorHandler);

if (serverEnv.nodeEnv === 'production') {
	app.get('*', (_req, res) =>
		res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
	);
}

export { app };
