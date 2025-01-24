import { Component } from '@angular/core';
import { GeneralSummary, SharedModule, SubMissionStateService, UserSubmissionResponse } from '../../../../shared';
import { CommonModule } from '@angular/common';
import { AdvisorUiContainerComponent } from "../admin-ui-container/advisor-ui-container.component";
import { TableModule } from 'primeng/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { Observable, switchMap, tap } from 'rxjs';
import { CompanyResponse, ScoreSummary } from '../../../organization/interfaces';
import { groupUserSubmissions } from '../../../../core/utils/group-user-submissions';
import { RemoveQuotesPipe } from '../../../../shared/pipes/remove-quotes.pipe';
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { GrowthStage } from '../../../organization/interfaces';
import { Scoring } from '../../../../shared/business/services/onboarding.questions.service';
import { BusinessAndInvestorMatchingService } from '../../../../shared/business/services/busines.and.investor.matching.service';
import { CONNECTED_COMPANIES_QUESTION_IDS } from '../../../../shared/business/services/onboarding.questions.service';
import { Progress } from '../../../business/interfaces/progress.interface';


@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [SharedModule, EditorModule, CommonModule, FormsModule, AdvisorUiContainerComponent, TableModule, CommonModule, RouterModule, ModalComponent, RemoveQuotesPipe],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})

export class ClientDetails {
  //vars
  investorEligibilityScore: string = '0';
  investorPreparednessScore: string = '0';
  impactAssessmentScore: string = '0';
  currentModal: 'eligibility' | 'preparedness' = 'eligibility';
  currentCompany!: CompanyResponse;
  preparednessAnswers: UserSubmissionResponse[] = [];
  factSheetAnswers: UserSubmissionResponse[] = [];
  impactElementAnswers : UserSubmissionResponse[] = [];
  eligibilityAnswers: UserSubmissionResponse[] = [];
  preparednessScore = parseFloat(this.investorPreparednessScore);
  InvestorEligibilitygeneralSummary: GeneralSummary | undefined;
  InvestorPreparednessgeneralSummary: GeneralSummary | undefined;
  eligibilityScore = parseFloat(this.investorEligibilityScore);
  submissions: UserSubmissionResponse[] = []



  //services
  private _route = inject(ActivatedRoute)
  private _companyService = inject(CompanyHttpService)
  private _submissionStateService = inject(SubMissionStateService);
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)

  //booleans
  visible = false;
  factSheetVisible = false;
  impactElementVisible = false;


  //streams
  company_details$ = new Observable<CompanyResponse>()
  scoring$ = new Observable<Scoring>();
  submissions$ = new Observable<UserSubmissionResponse[]>
  factSheetSubmissions$  = new Observable<UserSubmissionResponse[]>
  esgSubmissions$  = new Observable<UserSubmissionResponse[]>
  preparednessSubmissions$  = new Observable<UserSubmissionResponse[]>

  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ =  new Observable<unknown>()
  impactAssessmentScore$ = new Observable<unknown>()
  investorPreparednessGeneralSummary$ = new Observable<GeneralSummary>()
  investorEligibilityGeneralSummary$ = new Observable<GeneralSummary>()
  progress$ =new Observable<any>();

  


  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');

   

    if(id){
      this.company_details$ = this._companyService.getCompanyOfUser(Number(id)).pipe(
           tap(res => {
             this.currentCompany = res
             const companyGrowthStage = this.getGrowthStageFromString(res.growthStage);

                          
            if(companyGrowthStage){
              this.progress$ =this._scoringService.advisorProgressView(companyGrowthStage,res.id,Number(id)).pipe(tap(res =>{
                this.progress =res.sort((a, b) => a.progress - b.progress);
              }))

              this.submissions$ = this._submissionStateService.getUserSubmissionsPerSection(Number(id),companyGrowthStage).pipe(tap(submissions => {
                this.eligibilityAnswers = groupUserSubmissions(submissions)
              }))


              this.preparednessSubmissions$ = this._submissionStateService.getUserPreparednessSubmissionsPerSection(Number(id),companyGrowthStage).pipe(tap(submissions => {
                this.preparednessAnswers = groupUserSubmissions(submissions)
              }))
            
            
              this.esgSubmissions$ = this._submissionStateService.getEsgSubmissionsPerSection(Number(id),companyGrowthStage).pipe(tap(submissions => {
                this.impactElementAnswers = groupUserSubmissions(submissions)
              }))
            
              this.factSheetSubmissions$ = this._submissionStateService.getFactSheetSubmissionsPerSection(Number(id),companyGrowthStage).pipe(tap(submissions => {
                this.factSheetAnswers = groupUserSubmissions(submissions)
              }))
            }          
      
             

             // Get the summaries
             this.scoring$ = this._scoringService.getOnboardingScores(companyGrowthStage,res.user.id).pipe(tap(scores => {
               this.impactAssessmentScore =scores.impactAssessment;
               this.investorEligibilityScore = scores.investorEligibility;
               this.investorPreparednessScore = scores.investorPreparedness;
             }))
             
             
             this.investorPreparednessGeneralSummary$ = this.scoring$.pipe(
               tap(scores => {
                 this.preparednessScore = parseFloat(scores.investorPreparedness);
               }),
               switchMap(() => this._scoringService.getGeneralSummary(this.preparednessScore, "PREPAREDNESS")),
               tap(generalSummary => {
                 this.InvestorPreparednessgeneralSummary = generalSummary;
               })
             );
      
             this.eligibilityScore = parseFloat(this.investorEligibilityScore);
      
             this.investorEligibilityGeneralSummary$ = this.scoring$.pipe(
               tap(scores => {
                 this.eligibilityScore = parseFloat(scores.investorEligibility);
               }),
               switchMap(() => this._scoringService.getGeneralSummary(this.eligibilityScore, "ELIGIBILITY")),
               tap(generalSummary => {
                 this.InvestorEligibilitygeneralSummary = generalSummary;
               })
             );
          
           })
         )
    }
  }


  showDialog(reportType: string) {
    if (reportType === this.investorEligibilityScore) {
      this.currentModal = "eligibility"
    } else if (reportType === this.investorPreparednessScore) {
      this.currentModal = "preparedness"
    }
    this.visible = !this.visible;
  }

  setDialog(dialog: string) {
    if (dialog === "factSheet") {
      this.factSheetVisible = !this.factSheetVisible;
    }else if(dialog = "impactAssesment"){
      this.impactElementVisible = !this.impactElementVisible
    }
  }


  getGrowthStageFromString(value: string): GrowthStage | undefined {
    const stage = Object.values(GrowthStage).find(stage => stage === value);
    return stage as GrowthStage | undefined;
  }

  progress:Progress[] =[
    {
      section: 'Investor Eligibility',
      progress: 0
    },
    {
      section: 'Investor Preparedness',
      progress: 0
    },
    {
      section: 'Impact Assessment',
      progress: 0
    },
    {
      section: 'Business Information',
      progress: 0
    },
    {
      section: 'Business Profile',
      progress: 0
    }
  ]

}
