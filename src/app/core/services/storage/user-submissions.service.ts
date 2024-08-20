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

}
