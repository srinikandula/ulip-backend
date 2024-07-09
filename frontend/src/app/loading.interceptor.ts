import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import {MessageService} from "primeng/api";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
      private loadingService: LoaderService,
      private router: Router,
      private messageService: MessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('caught');
    this.totalRequests++;
    this.loadingService.setLoading(true);

    return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loadingService.setLoading(false);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
    );
  }
}
