import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { User } from '../../../users/models';
import { OrganizationInfoContainerComponent } from "../organization-info-container/organization-info-container.component";
import { SubmissionService, UserSubmissionResponse } from '../../../../shared';
import { BUSINESS_INFORMATION_SUBSECTION_IDS, getInvestorEligibilitySubsectionIds, IMPACT_ASSESMENT_SUBSECTION_IDS, INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from '../../../../shared/business/services/onboarding.questions.service';
import { CompanyResponse } from '../../interfaces';
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation.service';
import { FeedbackService } from '../../../../core/services/feedback/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-submissions-info',
  standalone: true,
  imports: [CommonModule, OrganizationInfoContainerComponent, TabViewModule],
  templateUrl: './organization-submissions-info.component.html',
  styleUrl: './organization-submissions-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class OrganizationSubmissionsInfoComponent implements OnChanges {
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _confirmationService = inject(ConfirmationService);
  private _feedbackService = inject(FeedbackService);
  private _router =inject(Router)
  

  owner!: User;
  investorPreparednessResponses: UserSubmissionResponse[] = [];
  businessResponses: UserSubmissionResponse[] = [];
  investorEligibilityResponses: UserSubmissionResponse[] = [];
  impactAssessmentResponses: UserSubmissionResponse[] = [];

  activeTab: string = 'investorEligibility';
  investorEligibilityScore: string = '0';
  investorPreparednessScore: string = '0';
  impactAssessmentScore: string = '0';
  delete$ =new Observable<unknown>();

  isInvestor:boolean = false

  constructor(){
    let investor = sessionStorage.getItem('profileId')

    if(investor){
      this.isInvestor = true
    }

  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabName(tabName: string){
    switch(tabName){
      case 'investorEligibility':
        return 'Investor Eligibility'
      case 'investorPreparedness':
        return 'Investor Preparedness'
      case 'businessResponses':
        return 'Business Information'
      case 'impactAssessment':
        return 'Impact Assessment'
      default:
        return ''
    }
  }

  getSubmissionIds(tabName: string){
    let  submissions:UserSubmissionResponse[];
    switch(tabName){
      case 'investorEligibility':
        submissions =this.investorEligibilityResponses
        break;
      case 'investorPreparedness':
        submissions = this.investorPreparednessResponses
        break;
      case 'businessResponses':
        submissions = this.businessResponses;
        break;
      case 'impactAssessment':
        submissions = this.impactAssessmentResponses
        break
      default:
        submissions =[]
    }
    return submissions.map(submission =>submission.id)
  }

  deleteSubmission(tabName:string) {
    const sectionName =this.getTabName(tabName);
    const submissionIds =this.getSubmissionIds(tabName)

    

    this.delete$ = this._confirmationService.confirm(`Are you sure to remove user submissions from the ${sectionName} section?`)
      .pipe(switchMap(res => {
        if (res) {
          return this._userSubmissionsService.deleteUserSubmissions(submissionIds)
        }
        return EMPTY
      }), tap(() => {
        this._feedbackService.success(`Submissions for ${sectionName} were removed successfully`);
        // TODO: handle changes without reload
        window.location.reload();
      }))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && changes['company'].currentValue) {
      this.company = changes['company'].currentValue;
      this.owner = this.company.user

      this.investorEligilityResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, getInvestorEligibilitySubsectionIds(this.company.growthStage).ID).pipe(tap(res => {
        this.investorEligibilityResponses = res
      }))

      this.businessResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, BUSINESS_INFORMATION_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.businessResponses = res
      }))

      this.investorPreparednessResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.investorPreparednessResponses = res
      }))

      this.impactAssessmentResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.impactAssessmentResponses = res
      }))


      this.scoring$ = this._scoringService.getOnboardingScores(this.company.growthStage, this.company.user.id).pipe(tap(scores => {
        this.investorEligibilityScore = scores.investorEligibility;
        this.investorPreparednessScore = scores.investorPreparedness;
        this.impactAssessmentScore = scores.impactAssessment;
      }))
    }
  }

  @Input({ required: true }) company!: CompanyResponse

  private _userSubmissionsService = inject(SubmissionService);

  submissions$: Observable<UserSubmissionResponse[]> = new Observable();

  investorEligilityResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  businessResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  investorPreparednessResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  impactAssessmentResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  scoring$ = new Observable();

}
