import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {inject} from "@angular/core";

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const userRole = authService.currentUserValue?.role

  if (!authService.currentUserValue || (userRole && userRole < expectedRole)) {
    router.navigate(['forbidden']).then(r => console.log(r));
    return false;
  }

  return true;
};
