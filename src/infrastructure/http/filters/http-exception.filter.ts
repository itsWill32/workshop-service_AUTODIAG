import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
        details = responseObj.details || null;

        if (Array.isArray(message)) {
          details = message;
          message = 'Validation failed';
        }
      }
    }
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;

      if (exception.name.includes('NotFound')) {
        status = HttpStatus.NOT_FOUND;
      } else if (exception.name.includes('AlreadyExists') || exception.name.includes('Duplicate')) {
        status = HttpStatus.CONFLICT;
      } else if (exception.name.includes('Invalid')) {
        status = HttpStatus.BAD_REQUEST;
      } else if (exception.name.includes('NotOwned') || exception.name.includes('Forbidden')) {
        status = HttpStatus.FORBIDDEN;
      }
    }

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${error} - Message: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      error,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}