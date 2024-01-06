import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  /**
   * Intercepts incoming HTTP requests and logs request details.
   * @param req - The incoming request object.
   * @param res - The outgoing response object.
   * @param next - The next function to continue the request-response cycle.
   */
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Logging HTTP request ${req.headers['user-agent']} ${req.method} ${req.url} ${res.statusCode}`
    );
    next();
  }
}
