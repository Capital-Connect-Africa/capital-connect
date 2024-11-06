import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY, switchMap, map } from "rxjs";
import { OverviewSectionComponent } from "../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../shared/business/services/busines.and.investor.matching.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness, MatchMakingStats, ConnectionRequestBody, ConnectionRequest, updateConnectionRequestBody, ConnectionRequestsStats, DeclineReasons } from '../../../../shared/interfaces';
import { ConfirmationService, FeedbackService } from '../../../../core';
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
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-connection-requests',
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
    DebouncedSearchComponent,
    DropdownModule
],
  templateUrl: './ConnectionRequests.component.html',
  styleUrl: './ConnectionRequests.component.scss',
  providers: [PaginationService]
})
export class ConnectionRequestsComponent {
  //services

  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _confirmationService = inject(ConfirmationService);
  private _feedBackService = inject(FeedbackService)

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
  selectedBusiness: ConnectionRequest | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;
  rejectedBusinesses: ConnectedBusiness[] = [];
  declineReasons: DeclineReasons[] = [];
  companyDetails: ConnectionRequest | undefined;
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
  connectionRequests!: ConnectionRequest[]
  filteredConnectionRequests!: ConnectionRequest[]
  connectionRequestDetails!: ConnectionRequest
  status: string[] = ["Pending","Accepted","Declined"]



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //streams
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
  deleteConnectionRequest$ = new Observable<unknown>()
  viewConnectionRequest$ = new Observable<ConnectionRequest>()
  deleteConf$ = new Observable<boolean>();
  updateConnectionRequest$ = new Observable<unknown>()
  declined_requests = false

  conReqStats!:ConnectionRequestsStats 





  constructor(private fb: FormBuilder,private router: Router) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
    });

    const currentUrl = this.router.url;
    if (currentUrl.includes('declined-connection-requests')) {
      this.declined_requests = true
    } else {
      this.declined_requests = false
    }
  }


  connectionRequest$ = this._businessMatchingService.getConnectionRequestByInvestor(this.currentPage+1, this.pageSize).pipe(tap(res=>{
    this.connectionRequests = res
    if(this.declined_requests){
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved !== true && connection.isApproved !== null);
    }else{
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved !== true && connection.isApproved !== false);
    }
  }))

  conReqStats$ = this._businessMatchingService.getConnectionRequestsStats().pipe(tap(res=>{
    this.conReqStats = res
    if(this.declined_requests){
      this.totalItems = res.declined
    }else if(!this.declined_requests){
      this.totalItems = res.requested 
    }
    
  }))



  matchMakingStats$ = this._businessMatchingService.getMatchMakingStatistics().pipe(tap(res => {
    // this.totalItems = res?.requested
  }))


  declineReasons$ = this._businessMatchingService.getDeclineReasons().pipe(
    map(reasons => reasons.filter(reason => reason.declineRole === "investor")),
    tap(filteredReasons => {
      this.declineReasons = filteredReasons;
    })
  );
  

  updateConnectionRequest(connectionRequest:ConnectionRequest){
    let investorProfileId = Number(sessionStorage.getItem('profileId'))

    let payload:updateConnectionRequestBody ={
      investorProfileId: investorProfileId,
      companyId: connectionRequest.company.id,
      isApproved: connectionRequest.isApproved
    }

    this.updateConnectionRequest$ = this._businessMatchingService.updateConnectionRequest(payload).pipe(
      tap(() => {
        this._feedBackService.success("Connection Request updated successfully")
        this.connectionRequest$ = this._businessMatchingService.getConnectionRequestByInvestor(this.currentPage + 1, this.pageSize).pipe(
          tap(res => {
            this.connectionRequests = res;
            this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved !== true);

          })
        );
      })
    );
    

  }

  viewConnectionRequest(id:number){
    this.viewConnectionRequest$ = this._businessMatchingService.getConnectionRequestById(id).pipe(tap(res =>{
      this.connectionRequestDetails = res
    }))
  }
  

  onStatusChange(event: any): void {
    if(event.value == "Accepted"){
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved === true);
    }else if(event.value == "Declined"){
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved === false);
    }else if(event.value == "Pending"){
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved === null);
    }
  }
  


  deleteConnectionRequest(id:number){
    this.deleteConf$ = this._confirmationService.confirm('Are you sure you want to delete this connection request?').pipe(tap(conf =>{
      if(conf){
        this.deleteConnectionRequest$ = this._businessMatchingService.deleteConnectionRequest(id).pipe(tap(res => {
          this.connectionRequest$ = this._businessMatchingService.getConnectionRequestByInvestor(this.currentPage+1, this.pageSize).pipe(tap(res=>{
            this.connectionRequests = res
          }))    
        }))           
      }
    }))
  }

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; 
    this.pageSize = event.pageSize;
    this.pageSize = event.pageSize;  
    
    this.connectionRequest$ = this._businessMatchingService.getConnectionRequestByInvestor(this.currentPage+1, this.pageSize).pipe(tap(res=>{
      this.connectionRequests = res
      this.filteredConnectionRequests = this.connectionRequests.filter(connection => connection.isApproved !== true);

    }))
  }

  onPageChange(page: number) {
    this.currentPage = page;
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



  showDetails(business: ConnectionRequest): void {
    this.table = !this.table
    this.selectedBusiness = business;
    const companyGrowthStage = this.getGrowthStageFromString(business.company.growthStage);

    this.companyDetails$ = this._businessMatchingService.getConnectionRequestById(business.id).pipe(
      tap(res => {
        this.companyDetails = res
        this.useOfFunds = this.companyDetails.company.useOfFunds

        // this.submissions$ = this._businessMatchingService.getSubmisionByIds(res.user.id,CONNECTED_COMPANIES_QUESTION_IDS).pipe(tap(submissions=>{
        //   this.submissions =  submissions
        // }))

        // this.scoring$ = this._scoringService.getOnboardingScores(companyGrowthStage,res.user.id).pipe(tap(scores => {
        //   this.impactAssessmentScore =scores.impactAssessment;
        //   this.investorEligibilityScore = scores.investorEligibility;
        //   this.investorPreparednessScore = scores.investorPreparedness;
        // }))
        
        
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


  trackByIndex(index: number): number {
    return index;
  }

  openModal(businessId: number){
    this.business__id = businessId
    this.decline = true
  }
  
  downloadCSV$ = new Observable<Blob>
  downloadCSV(status:string){this.downloadCSV$ = this._businessMatchingService.matchMakingCsv(status).pipe(tap(res=>{ })) }
}