import { type Response } from 'express';
import {
	NotFoundError,
	UnAuthorizedError,
	ValidationError,
	ForbiddenError
} from './errors';

export class Rsp {
	static success(res: Response, message: any = '', status: number) {
		return res.status(status).json({
			ok: true,
			status,
			body: message
		});
	}

	static error(res: Response, error: unknown, msg?: string) {
		let message: string;
		let status: number;

		if (
			error instanceof NotFoundError ||
			error instanceof UnAuthorizedError ||
			error instanceof ForbiddenError ||
			error instanceof ValidationError
		) {
			message = error.message;
			status = error.statusCode;
		} else {
			message = msg || 'Internal server error';
			status = 500;
		}

		return res.status(status).json({
			ok: false,
			status,
			message
		});
	}
}