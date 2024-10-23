import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { FeedbackService } from '../../core';

export const isInvestorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkIsInvestor();
}

export const isInvestorChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkIsInvestor();
}

function hasProfileId(): boolean {
  return !!sessionStorage.getItem('profileId');
}

function checkIsInvestor() {
  const location = inject(Location);
  const feedBackService = inject(FeedbackService);

  if (hasProfileId()) {
    return true;
  }

  feedBackService.warning('You are not authorized to view this page, Kindly contact the administrator.');

  location.back();
  return false;
}
