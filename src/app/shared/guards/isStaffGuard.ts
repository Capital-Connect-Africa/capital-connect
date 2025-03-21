import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Location } from '@angular/common';
import { FeedbackService } from '../../core';

export const isStaffCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return isUserStaff();
}

export const isStaffCanActivateChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return isUserStaff();
}

function isUserStaff() {
  const authStateService = inject(AuthStateService);
  const location = inject(Location);
  const feedBackService = inject(FeedbackService);

  if (authStateService.userIsStaff) {
    return true;
  }

  feedBackService.warning('You are not authorized to view this page, Kindly contact the administrator.')

  location.back();
  return false;
}
