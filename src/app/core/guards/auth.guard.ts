import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { AuthenticationService } from '../services/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authenticationService.validateToken().pipe(
      map((isValid: boolean) => {
        if (isValid) {
            console.log("Token is valid, user is authenticated.");
          return true;
        } else {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      })
    );
  }
}
