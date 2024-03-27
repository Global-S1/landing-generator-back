abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
    }
}
export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor(message: string) {
        super(message);
    }
}
export class BadRequest extends CustomError {
    statusCode = 400;
    constructor(message: string) {
        super(message);
    }
}
export class NotAcceptable extends CustomError {
    statusCode = 406;
    constructor(message: string) {
        super(message);
    }
}
export class InternalServerError extends CustomError{
    statusCode = 500;
    constructor(message: string) {
        super(message);
    }
}