import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { FORM_TYPE } from '../../features/auth/interfaces/auth.interface';
import { ReferralsService } from '../../features/admin/services/referrals.service';

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

async function checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  const referralService =inject(ReferralsService);

  // Check if the URL is empty
  const url = state.url;
  const { referralId } =route.queryParams;
  if (url === '/') {
    if(referralId) window.history.pushState(null, '', '/');
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
  let signup =false;  
    
  if(referralId){
    signup =true;
    await referralService.updateMetrics('', false, true, referralId);
  }
  
  router.navigateByUrl('/', { state: { mode: signup? FORM_TYPE.SIGNUP : FORM_TYPE.SIGNIN  } });
  return false;
}
