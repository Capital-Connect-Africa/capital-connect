import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Location } from '@angular/common';
import { FeedbackService } from '../../core';

export const isPartnerCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return isUserPartner();
}

export const isPartnerCanActivateChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return isUserPartner();
}

function isUserPartner() {
  const authStateService = inject(AuthStateService);
  const location = inject(Location);
  const feedBackService = inject(FeedbackService);

  if (authStateService.userIsPartner) {
    return true;
  }

  feedBackService.warning('You are not authorized to view this page, Kindly contact the administrator.')

  location.back();
  return false;
}
