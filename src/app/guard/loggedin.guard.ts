import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const loggedinGuard: CanActivateFn = (route) => {

  const path: string | undefined = route.routeConfig?.path;
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue && (path === 'login' || path === 'register')) {
    router.navigate(['']).then(r => console.log(r));
    return false;
  }
  return true;
};
