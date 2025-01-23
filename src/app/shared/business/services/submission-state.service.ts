import { inject, Injectable } from '@angular/core';
import { SubmissionService } from './submission.service';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { BehaviorSubject, EMPTY, forkJoin, map, of, tap } from 'rxjs';
import { UserSubmissionResponse } from '../../interfaces/submission.interface';
import { LoadingService } from '../../../core';
import { getInvestorEligibilitySubsectionIds } from './onboarding.questions.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from './onboarding.questions.service';
import {BUSINESS_INFORMATION_SUBSECTION_IDS } from './onboarding.questions.service';
import { IMPACT_ASSESMENT_SUBSECTION_IDS } from './onboarding.questions.service';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { GrowthStage } from '../../../features/organization/interfaces';

@Injectable({ providedIn: 'root' })
export class SubMissionStateService {
  private _signalService =inject(SignalsService);
  private _submissionService = inject(SubmissionService);
  private _authStateService = inject(AuthStateService);

  private _currentUserId = this._authStateService.currentUserId() && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId() : Number(sessionStorage.getItem('userId'));

  private _currentUserSubmissionSrc$$ = new BehaviorSubject<UserSubmissionResponse[]>([]);
  private _loadingService = inject(LoadingService)
  private _companyService = inject(CompanyStateService)

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
    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    if (userId) {
      return this._submissionService.fetchSubmissionsByUser(userId).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    return EMPTY;
  }

  getUserSubmissionsPerSection(user_id?:number,growthStage?:GrowthStage) {
    if(user_id && growthStage){
      const sectionId = getInvestorEligibilitySubsectionIds(growthStage)
      return this._submissionService.fetchSubmissionsByUserPerSection(user_id, sectionId.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }

    const sectionId = getInvestorEligibilitySubsectionIds(this._companyService.currentCompany.growthStage)
    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    if (userId) {
      return this._submissionService.fetchSubmissionsByUserPerSection(userId, sectionId.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    return EMPTY;
  }


  getUserPreparednessSubmissionsPerSection(user_id?:number,growthStage?:GrowthStage) {
    if(user_id && growthStage){
      return this._submissionService.fetchSubmissionsByUserPerSection(user_id, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }

    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    if (userId) {
      return this._submissionService.fetchSubmissionsByUserPerSection(userId, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    return EMPTY;
  }


  getEsgSubmissionsPerSection(user_id?:number,growthStage?:GrowthStage) {
    if(user_id && growthStage){
      return this._submissionService.fetchSubmissionsByUserPerSection(user_id, IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    
    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    if (userId) {
      return this._submissionService.fetchSubmissionsByUserPerSection(userId, IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    return EMPTY;
  }

  getFactSheetSubmissionsPerSection(user_id?:number,growthStage?:GrowthStage) {
    if(user_id && growthStage){
      return this._submissionService.fetchSubmissionsByUserPerSection(user_id, BUSINESS_INFORMATION_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    
    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    if (userId) {
      return this._submissionService.fetchSubmissionsByUserPerSection(userId, BUSINESS_INFORMATION_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.setCurrentUserSubmission(res);
      }));
    }
    return EMPTY;
  }

  getUserSubmissionsScore() {
    return this._submissionService.getSubmissionsScores(this._currentUserId).pipe(tap(res => {
      this._loadingService.setLoading(true)
    }));
  }

  getSectionSubmissions(force =false){
    if(this._signalService.userSectionSubmissions() && !force) return of(this._signalService.userSectionSubmissions())
    const userId = this._currentUserId && this._currentUserId > 0 ? this._currentUserId : Number(sessionStorage.getItem('userId'));
    const requests =[
      this._submissionService.fetchSubmissionsByUserPerSection(userId,  getInvestorEligibilitySubsectionIds(this._companyService.currentCompany.growthStage).ID),
      this._submissionService.fetchSubmissionsByUserPerSection(userId, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID),
      this._submissionService.fetchSubmissionsByUserPerSection(userId, BUSINESS_INFORMATION_SUBSECTION_IDS.ID),
      this._submissionService.fetchSubmissionsByUserPerSection(userId, IMPACT_ASSESMENT_SUBSECTION_IDS.ID),
    ]
    return forkJoin(requests).pipe(map(res =>{
      this._signalService.userSectionSubmissions.set(
        {
          investor_eligibility: res[0],
          investor_preparedness: res[1],
          business_information: res[2],
          impact_assessment: res[3],
  
        }
      )
      return this._signalService.userSectionSubmissions();
    }))
  }
}
