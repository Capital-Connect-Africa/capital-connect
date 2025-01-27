import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreateUserInput,
  MobileNumber,
  Profile,
} from '../interfaces/auth.interface';
import { BASE_URL, BaseHttpService, FeedbackService } from '../../../core';
import { Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';
import { OrganizationOnboardService } from '../../organization/services/organization-onboard.service';
import { ReferralTokenService } from '../../../shared/services/referral-token.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseHttpService {
  private _feedBackService = inject(FeedbackService);
  private _authStateService = inject(AuthStateService);
  private _referralTokenService = inject(ReferralTokenService);
  private _organizationService = inject(OrganizationOnboardService);

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

  signUpUser(user: CreateUserInput) {
    return this.create(`${BASE_URL}/auth/signup`, JSON.stringify(user)).pipe(
      tap(() => {
        this._feedBackService.success(
          'Signed Up Successfully, Open your email to verify.'
        );
        this._referralTokenService.removeToken();
      })
    );
  }

  getUserProfile() {
    return this.read(
      `${BASE_URL}/users/profile`
    ) as unknown as Observable<Profile>;
  }

  login(loginInfo: { username: string; password: string }) {
    return this.create(
      `${BASE_URL}/auth/login`,
      JSON.stringify(loginInfo)
    ).pipe(
      switchMap((res: any) => {
        this._authStateService.reset();
        this._organizationService.reset();
        this._feedBackService.success('Logged In Successfully, Welcome.');
        this._authStateService.initToken(
          (res as { access_token: string }).access_token
        );
        return this.getUserProfile().pipe(
          tap((userProfile) => {
            this._authStateService.initUser(userProfile);
            const mobileNumbers: MobileNumber[] = (
              userProfile.mobileNumbers ?? []
            ).map((phoneNo) => {
              return {
                phoneNo: phoneNo.phoneNo,
                isVerified: phoneNo.isVerified,
              };
            });
            sessionStorage.setItem(
              'mobile_numbers',
              JSON.stringify(mobileNumbers) ?? []
            );
          })
        ) as Observable<Profile>;
      })
    );
  }

  forgotPassword(email: string) {
    return this.create(`${BASE_URL}/users/request-password-reset`, {
      email: email,
    });
  }

  sendNewPassword(val: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.create(`${BASE_URL}/users/reset-password`, val);
  }

  verifyEmail(token: string) {
    const params = new HttpParams().set('token', token);
    return this._httpClient.get(`${BASE_URL}/users/verify-email`, {
      params: params,
    });
  }

  resendVerification(email: string) {
    return this.create(`${BASE_URL}/auth/resend-verification-email`, {
      email: email,
    }) as Observable<{ message: string }>;
  }
}
