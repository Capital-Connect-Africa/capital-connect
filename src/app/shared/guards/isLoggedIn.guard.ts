import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { FORM_TYPE } from '../../features/auth/interfaces/auth.interface';

export const isLoggedInCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkLogin(route, state);
}

export const isLoggedInCanActivateChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkLogin(route, state);
}

function checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  // Check if the URL is empty
  const url = state.url;

  if (url === '/') {
    if (authStateService.isLoggedIn && !authStateService.userIsAdmin) {
      router.navigateByUrl('/user-profile');
      return false;
    }  else if(authStateService.userIsAdmin){
      router.navigateByUrl('/dashboard')
      return false;
    }
    return true;
  }


  if (authStateService.isLoggedIn) {
    return true;
  }
  authStateService.next =url;
  router.navigateByUrl('/', { state: { mode: FORM_TYPE.SIGNIN } });
  return false;
}
