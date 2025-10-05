// src/app/auth/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  // Skip intercepting auth endpoints
  if (
    req.url.endsWith('/auth/login') ||
    req.url.endsWith('/auth/refresh') ||
    req.url.endsWith('/auth/logout')
  ) {
    return next(req);
  }

  let modifiedReq = req;

  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Try refreshing the token
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            if (!newToken) {
              return throwError(() => err);
            }

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              }
            });

            return next(retryReq);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
