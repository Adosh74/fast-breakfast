import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { NotFound } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { requestLoggerMiddleware } from './middlewares/request-logger';
import { routes } from './routes';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);

if (process.env.NODE_ENV !== 'test') {
	app.use(requestLoggerMiddleware);
}

app.use('/api', routes);

app.all('*', () => {
	throw new NotFound();
});

app.use(errorHandler);

export { app };
