import { NextFunction, Request, Response } from 'express'
import { InternalServerError, NotFoundError, BadRequest, NotAcceptable } from '../utils/errors'


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    let message: string
    let status: number

    if (
        err instanceof NotFoundError ||
        err instanceof  NotAcceptable ||
        err instanceof BadRequest ||
        err instanceof InternalServerError
    ) {
        message = err.message
        status = err.statusCode
    } else {
        message = err.message || 'Internal server error'
        status = 500
    }
    console.log(err.stack)
    res.status(status).json({
        ok: false,
        status,
        message
    })
}
