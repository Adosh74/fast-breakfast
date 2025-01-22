import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { serverEnv } from '../config';

const scryptAsync = promisify(scrypt);

export class Password {
	static async toHash(password: string) {
		const salt = randomBytes(8).toString('hex');
		const buf = (await scryptAsync(password + serverEnv.pepper, salt, 64)) as Buffer;

		return `${buf.toString('hex')}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split('.');
		const buf = (await scryptAsync(
			suppliedPassword + serverEnv.pepper,
			salt,
			64
		)) as Buffer;

		return hashedPassword === buf.toString('hex');
	}
}
