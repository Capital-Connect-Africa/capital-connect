import { Injectable } from '@angular/core';
import { Submission } from '../../../shared/interfaces/submission.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSubmissionsService {

  impactAssessmentSubmissions:Submission[][] =[];
  investorEligibilitySubmissions:Submission[][] =[];
  businessInformationSubmissions:Submission[][] =[];
  investorPreparednessSubmissions:Submission[][] =[];

  impactAssessmentDraft:Submission[][] =[];
  investorEligibilityDraft:Submission[][] =[];
  businessInformationDraft:Submission[][] =[];
  investorPreparednessDraft:Submission[][] =[];


  saveBusinessInformationSubmissionProgress(submissions:Submission[], step =0){
    const submissionsCount =this.businessInformationSubmissions.length;
    if(submissionsCount <=step) this.businessInformationSubmissions.push(submissions);
    else this.businessInformationSubmissions[step] =submissions;
  }

  saveInvestorEligibilitySubmissionProgress(submissions:Submission[], step =0){
    const submissionsCount =this.investorEligibilitySubmissions.length;
    if(submissionsCount <=step) this.investorEligibilitySubmissions.push(submissions);
    else this.investorEligibilitySubmissions[step] =submissions;
  }

  saveInvestorPreparednessSubmissionProgress(submissions:Submission[], step =0){
    const submissionsCount =this.investorPreparednessSubmissions.length;
    if(submissionsCount <=step) this.investorPreparednessSubmissions.push(submissions);
    else this.investorPreparednessSubmissions[step] =submissions;
  }

  saveImpactAssessmentSubmissionProgress(submissions:Submission[], step =0){
    const submissionsCount =this.impactAssessmentSubmissions.length;
    if(submissionsCount <=step) this.impactAssessmentSubmissions.push(submissions);
    else this.impactAssessmentSubmissions[step] =submissions;
  }
}
