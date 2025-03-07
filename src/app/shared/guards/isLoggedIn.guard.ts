import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { FORM_TYPE } from '../../features/auth/interfaces/auth.interface';
import { ReferralsService } from '../../features/admin/services/referrals.service';

export const isLoggedInCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkLogin(route, state);
};

export const isLoggedInCanActivateChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkLogin(route, state);
};

async function checkLogin(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  const referralService = inject(ReferralsService);
  // Check if the URL is empty
  const url = state.url;
  const { r } = route.queryParams; // r: stands referral id
  
  if (url.split("?").at(0) === '/auth') {
    if (authStateService.isLoggedIn) {
      if(authStateService.userIsAdmin) router.navigateByUrl('/dashboard');
      else if(authStateService.userIsPartner) router.navigateByUrl('/partner');
      else if(authStateService.userIsStaff)  {
        router.navigateByUrl('/staff');
      }
      else router.navigateByUrl('/user-profile');
      return false;
    }
    return true;
  }

  if (authStateService.isLoggedIn) {
    return true;
  }
  let signup = url.split('/').includes('signup');

  if (r) {
    signup =true;
    await referralService.updateMetrics('', false, true, r);
  }

  router.navigateByUrl('/auth', {
    state: { mode: signup ? FORM_TYPE.SIGNUP : FORM_TYPE.SIGNIN },
  });
  return false;
}
