import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private auth: AuthService
  ) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.auth.currentUserValue;

    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    // Resend email verification link route needs token when currentUser is null
    // "lastToken" is saved in a property after successful login endpoint call
    if (!currentUser && this.auth.lastToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.lastToken}`
        }
      });
    }

    return next.handle(request);
  }
}
