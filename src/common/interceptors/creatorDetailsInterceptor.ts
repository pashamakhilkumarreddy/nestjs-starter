import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { KeyCloakUserObject } from '../constants';

@Injectable()
export class CreatorDetailsInterceptor implements NestInterceptor {
  /**
   * Intercepts the execution context and modifies the request body to include creator information.
   * @param context - The execution context.
   * @param next - The next call handler.
   * @returns An observable or promise of an observable.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const contentType = request.headers['content-type'];
    const user: KeyCloakUserObject = response.locals.user;
    if (user) {
      if (contentType === 'application/json') {
        if (request.method.toLocaleLowerCase() === 'post') {
          request.body.createdBy = user.userId;
          request.body.modifiedBy = user.userId;
        } else if (
          ['put', 'patch'].includes(request.method.toLocaleLowerCase())
        ) {
          request.body.modifiedBy = user.userId;
        }
      }
    }
    return next.handle();
  }
}
