import { HttpException, HttpStatus } from '@nestjs/common';

export class RateLimitException extends HttpException {
    constructor(message: string) {
        super({ statusCode: HttpStatus.TOO_MANY_REQUESTS, message }, HttpStatus.TOO_MANY_REQUESTS);
    }
}
