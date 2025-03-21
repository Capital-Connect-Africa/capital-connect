import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  BASE_URL,
  BaseHttpService,
  ConfirmationService,
  FeedbackService,
} from '../../../core';
import { Router } from '@angular/router';
import {
  FORM_TYPE,
  MobileNumber,
  Profile,
  UserMobileNumbersIssues,
} from '../interfaces/auth.interface';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { UserSubmissionsService } from '../../../core/services/storage/user-submissions.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _router = inject(Router);
  private _httpService = inject(BaseHttpService);
  private _signalsService = inject(SignalsService);
  private _feedBackService = inject(FeedbackService);
  private _userSubmission = inject(UserSubmissionsService);
  private _confirmationService = inject(ConfirmationService);

  currentToken: WritableSignal<string> =
    signal(sessionStorage.getItem('token') as string) ?? null;
  currentUserId: WritableSignal<number> =
    signal(Number(sessionStorage.getItem('userId') as string)) ?? null;
  currentUserName: WritableSignal<string> = signal(
    sessionStorage.getItem('userName') as string
  );
  currentUserProfile: WritableSignal<Profile> = signal(
    JSON.parse(sessionStorage.getItem('userProfile') as string)
  );

  initUser(user: Profile) {
    this._setCurrentUserId(user.id);
    this._setUserName(user.username);
    this._setUserProfile(user);
  }

  private _setUserProfile(user: Profile) {
    sessionStorage.setItem('userProfile', JSON.stringify(user));
    this.currentUserProfile.set(user);
  }

  reload() {
    return this._httpService.read(`${BASE_URL}/users/profile`).pipe(
      map((user: any) => {
        this._setUserProfile(user);
        return user;
      })
    );
  }

  initToken(token: string) {
    sessionStorage.setItem('token', token);
    this.currentToken.set(token);
  }

  initInvestorProfile(profileId: string) {
    sessionStorage.setItem('profileId', profileId);
  }

  get authToken() {
    return this.currentToken();
  }

  get userIsAdmin() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('admin');
  }

  get userIsPartner() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('partner');
  }

  get userIsStaff() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('staff');
  }

  get userIsAdvisor() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('advisor');
  }

  get userIsInvestor() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('investor');
  }

  get userIsUser() {
    const currentUser = JSON.parse(
      sessionStorage.getItem('userProfile') as string
    ) as Profile;
    return !!currentUser && currentUser.roles.includes('user');
  }

  get isLoggedIn() {
    const token = this.currentToken();
    return !!token;
  }

  private _setCurrentUserId(userId: number) {
    sessionStorage.setItem('userId', String(userId));
    this.currentUserId.set(userId);
  }

  private _setUserName(userName: string) {
    sessionStorage.setItem('userName', userName);
    this.currentUserName.set(userName);
  }

  private clearSession(feedback: boolean =true, redirectUser:boolean =true){
    this.reset();
    if(feedback) this._feedBackService.success('Logged Out! See you soon!');
    if(redirectUser)
      this._router.navigateByUrl('/', {
        state: { mode: FORM_TYPE.SIGNIN },
      });
  }

  logout(silent =false, redirectUser:boolean =true) {
    if(!silent){
      return this._confirmationService
        .confirm('Are you sure you want to log out?')
        .pipe(
          tap((confirmation) => {
            if (confirmation) {
              this.clearSession(redirectUser)
            }
          })
        );
    }
    this.clearSession(false, redirectUser)
    return of() as any;
  }

  saveUserPhoneNumberAddedStatus(phoneNo: string) {
    const userId = this.currentUserId();
    return this._httpService.create(BASE_URL + '/mobile-numbers', { phoneNo, userId }).pipe(map((res) => {
          this._feedBackService.success('Number saved successfully','Phone number update');
          this._signalsService.showDialog.set(false);
          this._signalsService.actionOnMobileNumbers.set(true);
          this._signalsService.actionBody.set({
            issue: UserMobileNumbersIssues.UNVERIFIED,
            command: 'Verify',
            message: 'Please Verify your phone number',
            title: 'Action Required',
          });
          const mobile_numbers: MobileNumber[] = JSON.parse(sessionStorage.getItem('mobile_numbers') ?? JSON.stringify([]));
          sessionStorage.setItem('mobile_numbers', JSON.stringify(mobile_numbers.push({ phoneNo, isVerified: false })));

          return res;
        }),
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  verifyPhoneNumber(otp: string, phoneNo: string) {
    return this._httpService.create(BASE_URL + '/mobile-numbers/verify', { otp, phoneNo }).pipe(map((res: any) => {
          const { success, message } = res;
          if (!success) {
            this._signalsService.showDialog.set(false);
            this._feedBackService.error(message, 'Phone number verification');
            return EMPTY;
          }
          this._feedBackService.success('Phone Number verified successfully','Phone number verification');
          this._signalsService.showDialog.set(false);
          this._signalsService.showInAppAlert.set(false);
          this._signalsService.actionOnMobileNumbers.set(false);
          const mobile_numbers: MobileNumber[] = JSON.parse(
            sessionStorage.getItem('mobile_numbers') ?? JSON.stringify([])
          );
          if (mobile_numbers.length) {
            mobile_numbers[0].isVerified = true;
            sessionStorage.setItem(
              'mobile_number',
              JSON.stringify(mobile_numbers)
            );
          }
          return res;
        }),
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  resendVerificationCode(phone:string){
    return this._httpService.create(BASE_URL+'/mobile-numbers/resend-verification',{phoneNo : phone}).pipe(tap(res=>{
      console.log("Response from resending otp", res)
    }))
  }



  checkPhoneNumberStatus(): Observable<any> {
    const result = this._checkPhoneNumberStatus();
    if (
      result !== UserMobileNumbersIssues.UNVERIFIED ||
      !this._signalsService.actionOnMobileNumbers()
    ) {
      return of(result);
    }
    return this._httpService.read(BASE_URL + '/users/profile').pipe(
      switchMap((userProfile: Profile | any) => {
        const mobileNumbers: MobileNumber[] = userProfile.mobileNumbers;
        sessionStorage.setItem(
          'mobile_numbers',
          JSON.stringify(mobileNumbers ?? [])
        );
        return of(this._checkPhoneNumberStatus());
      })
    );
  }

  private _checkPhoneNumberStatus() {
    const mobile_numbers: MobileNumber[] = JSON.parse(
      sessionStorage.getItem('mobile_numbers') ?? JSON.stringify([])
    );
    if (!mobile_numbers.length) return UserMobileNumbersIssues.EMPTY;
    const numbersVerified = mobile_numbers.some(
      (mobile_number) => mobile_number.isVerified
    );
    if (!numbersVerified) return UserMobileNumbersIssues.UNVERIFIED;
    return UserMobileNumbersIssues.VERIFIED;
  }

  reset() {
    sessionStorage.clear();
    this._signalsService.reset();
    this._userSubmission.reset();
    this.currentToken.set(null as any);
    this.currentUserId.set(null as any);
    this.currentUserName.set(null as any);
    this.currentUserProfile.set(null as any);
  }

  updateUserConsent(payload: {
    hasAcceptedTerms: boolean;
    hasAcceptedPrivacyPolicy: boolean;
  }) {
    return this._httpService.create(
      `${BASE_URL}/users/${this.currentUserId()}/accept-terms`,
      payload
    );
  }
}
