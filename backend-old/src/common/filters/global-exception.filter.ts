import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import { ZodError } from "zod";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        details =
          (responseObj.errors as unknown) || (responseObj.details as unknown);
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Validation error";
      details = exception.errors;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(`Unknown exception type: ${exception}`);
    }

    const errorResponse = {
      error: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details && { details }),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      JSON.stringify(details, null, 2),
    );

    response.status(status).json(errorResponse);
  }
}
