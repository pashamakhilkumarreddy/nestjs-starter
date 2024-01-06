import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HelperService {
  private readonly logger = new Logger(HelperService.name);

  /**
   * Fetches the user agent from the request headers.
   *
   * @param request - The request object.
   *
   * @returns The user agent string.
   */
  public fetchUserAgent(request: any) {
    this.logger.log('Fetching user agent');
    return request.headers['user-agent'] || '';
  }
}
