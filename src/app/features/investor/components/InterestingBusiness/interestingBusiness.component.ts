import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY, switchMap, map } from "rxjs";
import { OverviewSectionComponent } from "../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../shared/business/services/busines.and.investor.matching.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness, MatchMakingStats, ConnectionRequestBody, DeclineReasons } from '../../../../shared/interfaces';
import { FeedbackService } from '../../../../core';
import { AngularMaterialModule, GeneralSummary, UserSubmissionResponse } from '../../../../shared';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { CompanyResponse, GrowthStage } from '../../../organization/interfaces';
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { CONNECTED_COMPANIES_QUESTION_IDS, Score, Scoring } from '../../../../shared/business/services/onboarding.questions.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../core';
import { AdvertisementSpaceComponent } from '../../../../shared/components/advertisement-space/advertisement-space.component';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationService } from 'ngx-pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { DebouncedSearchComponent } from "../../../../core/components/debounced-search/debounced-search.component";

@Component({
  selector: 'app-interesting-business',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSectionComponent,
    CardComponent,
    ModalComponent,
    AngularMaterialModule,
    NavbarComponent,
    AdvertisementSpaceComponent,
    DialogModule,
    NgxPaginationModule,
    MultiSelectModule, ReactiveFormsModule,
    DebouncedSearchComponent
],
  templateUrl: './interestingBusiness.component.html',
  styleUrl: './interestingBusiness.component.scss',
  providers: [PaginationService]
})
export class InterestingBusinessComponent {
  //services
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _router = inject(Router)

  //booleans
  visible = false;
  decline: boolean = false;
  table:boolean = true


  //variables
  itemsPerPage: number = 10;
  currentPage: number = 0; // Start at 0 for Material paginator
  pageSize: number = 10;
  totalItems: number = 0; // Set total items
  currentModal = '';
  selectedBusiness: InterestingBusinesses | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;
  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: ConnectedBusiness[] = [];
  declineReasons: DeclineReasons[] = [];
  companyDetails: CompanyResponse | undefined;
  business__id: number = 0;
  declineForm!: FormGroup;
  investorEligibilityScore: string = '0';
  investorPreparednessScore: string = '0';
  impactAssessmentScore: string = '0';
  submissions: UserSubmissionResponse[] = []
  preparednessScore = parseFloat(this.investorPreparednessScore);
  InvestorPreparednessgeneralSummary: GeneralSummary | undefined;
  InvestorEligibilitygeneralSummary: GeneralSummary | undefined;
  eligibilityScore: number = 0;


  dataSource = new MatTableDataSource<ConnectedBusiness>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //streams
  markAsInteresting$ = new Observable<unknown>()
  connectWithCompany$ = new Observable<unknown>()
  cancelConnectWithCompany$ = new Observable<unknown>()
  cancelInterestWithCompany$ = new Observable<unknown>()
  companyDetails$ = new Observable<unknown>()
  public scoring$ = new Observable<Scoring>;
  submissions$ = new Observable<UserSubmissionResponse[]>
  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ =  new Observable<unknown>()
  impactAssessmentScore$ = new Observable<unknown>()
  investorPreparednessGeneralSummary$ = new Observable<GeneralSummary>()
  investorEligibilityGeneralSummary$ = new Observable<GeneralSummary>()
  useOfFunds: string[] = [];
  matchMakingStats: MatchMakingStats | undefined;
  search$ = new Observable<InterestingBusinesses[]>()



  constructor(private fb: FormBuilder) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
    });
  }


  
  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.pageSize).pipe(
    tap(res => {
      this.interestingBusinesses = res;
    })
  );

  matchMakingStats$ = this._businessMatchingService.getMatchMakingStatistics().pipe(tap(res => {
    this.totalItems = res?.interesting
  }))



  declineReasons$ = this._businessMatchingService.getDeclineReasons().pipe(
    map(reasons => reasons.filter(reason => reason.declineRole === "investor")),
    tap(filteredReasons => {
      this.declineReasons = filteredReasons;
    })
  );
  

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; 
    this.pageSize = event.pageSize;
    this.pageSize = event.pageSize;   
     
    this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage+1, this.pageSize).pipe(
       tap(res => {
        this.interestingBusinesses = res;
       })
   );
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  
  showDialog(current_modal: string) {
    if(current_modal === 'matched_businesses' ){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'interesting_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'connected_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }
    else if(current_modal === 'rejected_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }

  }


  getSubmissionTextById(questionId: number): string {
    const submission = this.submissions.find(s => s.question.id === questionId);
    if(submission?.question.type === "TRUE_FALSE" ){
      return submission.answer.text
    }else if(submission?.question.type === "MULTIPLE_CHOICE"){
      return submission.answer.text 
    }else if(submission?.question.type === "SINGLE_CHOICE"){
      return submission.answer.text 
    }else{
      return submission?.text || 'N/A';
    }
  }

  getGrowthStageFromString(value: string): GrowthStage | undefined {
    const stage = Object.values(GrowthStage).find(stage => stage === value);
    return stage as GrowthStage | undefined;
  }



  showDetails(business: InterestingBusinesses): void {
    this.table = !this.table
    this.selectedBusiness = business;


    // const companyGrowthStage2 = GrowthStage[business.company.growthStage as keyof typeof GrowthStage];
    const companyGrowthStage = this.getGrowthStageFromString(business.company.growthStage);


     //get the company details
    this.companyDetails$ = this._company.getSingleCompany(business.company.id).pipe(
      tap(res => {
        this.companyDetails = res
        this.useOfFunds = res.useOfFunds


        //get the questions
        this.submissions$ = this._businessMatchingService.getSubmisionByIds(res.user.id,CONNECTED_COMPANIES_QUESTION_IDS).pipe(tap(submissions=>{
          this.submissions =  submissions
        }))


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





  hideDetails(): void {
    this.table = true
    this.selectedBusiness = null;
    this.selectedMatchedBusiness = null;
  }


  onSearch(query: string): void {
    if (query){
      this.search$ = this._businessMatchingService.searchCompany('interesting', query).pipe(tap(res=>{
        this.interestingBusinesses = res
      }))
    }else{
      this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.pageSize).pipe(
        tap(res => {
          this.interestingBusinesses = res;
        })
      );
    }
  }






  trackByIndex(index: number): number {
    return index;
  }

  cancelConnection(businessId: number): void {
    this.cancelConnectWithCompany$ = this._businessMatchingService.cancelConnectWithCompany(businessId,[]).pipe(
      tap(() => {
        this._feedBackService.success('Connection cancelled successfully.');

        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage, this.itemsPerPage).pipe(
          tap(res => {this.interestingBusinesses = res;})
        );
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));   
       })
    );
  }

 

  openModal(businessId: number){
    this.business__id = businessId
    this.decline = true
  }
  
  submit(){
    this.cancelInterest(this.business__id)
  }

  cancelInterest(businessId: number): void {   

    if (this.declineForm.valid) {
      const selectedReasons: string[] = this.declineForm.get('reasons')?.value;
      this.cancelInterestWithCompany$ = this._businessMatchingService
        .cancelInterestWithCompany(businessId, selectedReasons).pipe(
          tap(() => {
            this._feedBackService.success('Interest cancelled successfully.');
            this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));  

            this.declineForm.reset();
            this.declineForm.updateValueAndValidity();

            this.decline = false;
          })
        );
    }

  }



  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.');
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;})); 
      })        
    );
  }

  connect(companyId: number) {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))

    let payload : ConnectionRequestBody = {
      investorProfileId: investorProfileId,
      companyId: companyId
    }

    this.connectWithCompany$ = this._businessMatchingService.createAConnectionRequest(payload).pipe(
      tap(()=>{
        this._feedBackService.success('Connection Request Created Succesfully');
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));      
      })
    )
  }

  downloadCSV$ = new Observable<Blob>
  downloadCSV(status:string){this.downloadCSV$ = this._businessMatchingService.matchMakingCsv(status).pipe(tap(res=>{ })) }
}