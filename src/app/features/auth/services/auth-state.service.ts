import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ConfirmationService, FeedbackService } from '../../../core';
import { Router } from '@angular/router';
import { FORM_TYPE, Profile } from '../interfaces/auth.interface';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  private _confirmationService = inject(ConfirmationService);
  private _feedBackService = inject(FeedbackService);
  private _router = inject(Router);

  currentToken: WritableSignal<string> = signal(sessionStorage.getItem('token') as string) ?? null
  currentUserId: WritableSignal<number> = signal(Number(sessionStorage.getItem('userId') as string)) ?? null
  currentUserName: WritableSignal<string> = signal(sessionStorage.getItem('userName') as string);
  currentUserProfile: WritableSignal<Profile> = signal(JSON.parse(sessionStorage.getItem('userProfile') as string));

  initUser(user: Profile) {
    this._setCurrentUserId(user.id);
    this._setUserName(user.username);
    this._setUserProfile(user);
  }

  private _setUserProfile(user: Profile) {
    sessionStorage.setItem('userProfile', JSON.stringify(user));
    this.currentUserProfile.set(user);
  }

  initToken(token: string) {
    sessionStorage.setItem('token', token);
    this.currentToken.set(token);
  }

  get authToken() {
    return this.currentToken();
  }

  get userIsAdmin() {
    const currentUser = JSON.parse(sessionStorage.getItem('userProfile') as string) as Profile;
    return !!currentUser && currentUser.roles.includes('admin');
  }

  removeToken() {
    this.currentToken.set(null as any);
    sessionStorage.clear();
  }

  get isLoggedIn() {
    const token = this.currentToken();
    return !!token
  }

  private _setCurrentUserId(userId: number) {
    sessionStorage.setItem('userId', String(userId));
    this.currentUserId.set(userId)
  }


  private _setUserName(userName: string) {
    sessionStorage.setItem('userName', userName)
    this.currentUserName.set(userName)
  }

  logout() {
    return this._confirmationService.confirm('Are you sure you want to log out?').pipe(tap(confirmation => {
      if (confirmation) {
        this.removeToken();
        sessionStorage.clear()
        this._feedBackService.success('Logged Out! See you soon!')
        this._router.navigateByUrl('/', { state: { mode: FORM_TYPE.SIGNIN } });
      }
    }))

  }

}