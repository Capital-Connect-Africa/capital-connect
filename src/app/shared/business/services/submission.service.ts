import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { BASE_URL, BaseHttpService, FeedbackService } from '../../../core';
import { Submission, SubmissionResponse, UserSubmissionResponse } from '../../interfaces/submission.interface';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class SubmissionService extends BaseHttpService {

  private _authStateService = inject(AuthStateService);
  private _feedBackService = inject(FeedbackService);
  private _currentUserId =  this._authStateService.currentUserId()  && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId()  : Number(sessionStorage.getItem('userId'))

  constructor(private _httpClient: HttpClient) {
    super(_httpClient)
  }

  createSingleSubmission(submission: Submission) {
    submission.userId = this._currentUserId
    return this.create(`${BASE_URL}/submissions`, submission).pipe((map(res => {
      this._feedBackService.success('Submitted Successfully')
      return res
    }))) as Observable<SubmissionResponse>;

  }

  createMultipleSubmissions(submissions: Submission[]): Observable<SubmissionResponse[]> {
    const valToSubmit = JSON.stringify({
      submissions: submissions.map(s => {
        return { ...s, userId: this._authStateService.currentUserId()  && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId() : Number(sessionStorage.getItem('userId')) };
      })
    });
    return this.create(`${BASE_URL}/submissions/bulk`, valToSubmit).pipe((map(res => {
      this._feedBackService.success('Submitted Successfully')
      return res

    }))) as Observable<SubmissionResponse[]>;

  }

  fetchSubmissionsByUser(userId: number): Observable<UserSubmissionResponse[]> {
    return this.readById(`${BASE_URL}/submissions/user`, userId).pipe((map(res => {
      return res
    }))) as Observable<UserSubmissionResponse[]>;
  }

  fetchSubmissionsByUserPerSection(userId: number,section:number): Observable<UserSubmissionResponse[]> {
    return this.read(`${BASE_URL}/submissions/user/${userId}/section/${section}`).pipe((map(res => {
      return res

    }))) as Observable<UserSubmissionResponse[]>;
  }

  calculateScoreOfUser(userId: number) {
    return this._httpClient.get(`${BASE_URL}/submissions/user/${userId}/score`) as Observable<{ score: number }>
  }

  getSubmissionsScores(userId: number) {
    return this._httpClient.get(`${BASE_URL}/submissions/user/${userId}/score`)
  }

  deleteUserSubmissions(submissionIds:number[]){
    const requests =submissionIds.map(id =>this._httpClient.delete(`${BASE_URL}/submissions/${id}`))
    return forkJoin(requests).pipe(map(res =>{
      return res
    }))
  }

}
