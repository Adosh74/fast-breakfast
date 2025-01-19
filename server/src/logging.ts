import fs from 'fs';
import path from 'path';
import { pino } from 'pino';
import pretty from 'pino-pretty';
import { serverEnv } from './config';

const streams: { write: any }[] = [
	serverEnv.nodeEnv === 'production' ? process.stdout : pretty(),
	fs.createWriteStream(path.join(__dirname, '..', 'process.log')),
];

const LOGGER = pino(
	{
		redact: {
			paths: ['body.password'],
			remove: true,
		},
		formatters: {
			bindings: () => ({}),
		},
	},
	pino.multistream(streams)
);

export { LOGGER };
