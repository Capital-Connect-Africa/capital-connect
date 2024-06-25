import { inject, Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { BehaviorSubject, tap } from 'rxjs';
import { UserSubmissionResponse } from '../../interfaces/submission.interface';

@Injectable({ providedIn: 'root' })
export class SubMissionStateService {

  private _submissionService = inject(SubmissionService);
  private _authStateService = inject(AuthStateService);

  private _currentUserId = this._authStateService.currentUserId();

  private _currentUserSubmissionSrc$$ = new BehaviorSubject<UserSubmissionResponse[]>([]);

  currentUserSubmission$ = this._currentUserSubmissionSrc$$.asObservable();

  get currentUserSubmission() {
    return this._currentUserSubmissionSrc$$.value;
  }

  setCurrentUserSubmission(submission: UserSubmissionResponse[]) {
    this._currentUserSubmissionSrc$$.next(submission)
  }


  clearUserSubmissionResponse() {
    return this._currentUserSubmissionSrc$$.next([])
  }

  getUserSubmissions() {
    return this._submissionService.fetchSubmissionsByUser(this._currentUserId).pipe(tap(res => {
      this.setCurrentUserSubmission(res);
    }));
  }

}