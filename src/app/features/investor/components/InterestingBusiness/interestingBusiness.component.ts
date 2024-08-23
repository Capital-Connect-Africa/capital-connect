import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY } from "rxjs";
import { OverviewSectionComponent } from "../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../shared/business/services/busines.and.investor.matching.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness } from '../../../../shared/interfaces';
import { FeedbackService } from '../../../../core';
import { AngularMaterialModule } from '../../../../shared';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { CompanyResponse, GrowthStage } from '../../../organization/interfaces';
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { Score } from '../../../../shared/business/services/onboarding.questions.service';
import { getInvestorEligibilitySubsectionIds } from '../../../../shared/business/services/onboarding.questions.service';
import { INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from '../../../../shared/business/services/onboarding.questions.service';
import { IMPACT_ASSESMENT_SUBSECTION_IDS } from '../../../../shared/business/services/onboarding.questions.service';
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
    MultiSelectModule, ReactiveFormsModule
  ],
  templateUrl: './interestingBusiness.component.html',
  styleUrl: './interestingBusiness.component.scss',
  providers: [PaginationService]
})
export class InterestingBusinessComponent {
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _router = inject(Router)
  visible = false;
  currentModal = '';

  itemsPerPage: number = 8;
  currentPage: number = 0; // Start at 0 for Material paginator
  pageSize: number = 8;
  totalItems: number = 100; // Set total items
  


  dataSource = new MatTableDataSource<ConnectedBusiness>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedBusiness: InterestingBusinesses | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;


  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: ConnectedBusiness[] = [];
  declineReasons: String[] = [];

  companyDetails: CompanyResponse | undefined;

  markAsInteresting$ = new Observable<unknown>()
  connectWithCompany$ = new Observable<unknown>()
  cancelConnectWithCompany$ = new Observable<unknown>()
  cancelInterestWithCompany$ = new Observable<unknown>()
  companyDetails$ = new Observable<unknown>()


  investorEligibilityScore: Score | undefined;
  investorPreparednessScore: Score | undefined;
  impactAssessmentScore: Score | undefined;

  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ =  new Observable<unknown>()
  impactAssessmentScore$ = new Observable<unknown>()


  constructor(private fb: FormBuilder) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
    });
  }


  
  table:boolean = true
  
  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, 10).pipe(
    tap(res => {
      this.interestingBusinesses = res;
      // this.totalItems = res.length;
    })
  );
  decline: boolean = false;
  business__id: number = 0;
  declineForm!: FormGroup;



  declineReasons$ = this._businessMatchingService.getDeclineReasons().pipe(tap(reasons => {
    this.declineReasons = reasons
  }))

  pageChange(event: PageEvent): void {
    console.log("The event is",event)

    this.currentPage = event.pageIndex; // Get the new page index
    console.log("The current page size is", this.currentPage)
    // console.log("The event page index is", event.pageIndex)

    this.pageSize = event.pageSize; // Update the page size
    // console.log("Event pageSize:", event.pageSize);

    this.pageSize = event.pageSize; // Get the new page size
    
    this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage+1, this.pageSize).pipe(
       tap(res => {
        this.interestingBusinesses = res;
         this.totalItems = res.length; 
         console.log("The length is", res.length)
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

    // this.visible = true
    // this.table =true
    // this.currentModal = current_modal;
    // this.selectedBusiness = null;
    // this.selectedMatchedBusiness = null;
  }

  showDetails(business: InterestingBusinesses): void {
    console.log("The business is", business)
    this.table = !this.table
    this.selectedBusiness = business;

    const companyGrowthStage = GrowthStage[business.company.growthStage as keyof typeof GrowthStage];

    //get the company details
    this.companyDetails$ = this._company.getSingleCompany(business.company.id).pipe(
      tap(res => {
        this.companyDetails = res

        //Get the submisions
        this.impactAssessmentScore$ = this._businessMatchingService.getSectionScore(business.company.id,IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(scores => {
          this.impactAssessmentScore =scores        
        }))

        this.investorEligibilityScore$ = this._businessMatchingService.getSectionScore(business.company.id,getInvestorEligibilitySubsectionIds(companyGrowthStage).ID).pipe(tap(scores => {
          this.investorEligibilityScore =scores        
        }))

        this.investorPreparednessScore$ = this._businessMatchingService.getSectionScore(business.company.id,INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(scores => {
          this.investorPreparednessScore =scores        
        }))      
      })
    )
   
  }




  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;

    const companyGrowthStage = GrowthStage[business.growthStage as keyof typeof GrowthStage];
     //get the company details
    this.companyDetails$ = this._company.getSingleCompany(business.id).pipe(
      tap(res => {
        this.companyDetails = res

        //Get the submisions
        this.impactAssessmentScore$ = this._businessMatchingService.getSectionScore(business.id,IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(scores => {
          this.impactAssessmentScore =scores        
        }))

        this.investorEligibilityScore$ = this._businessMatchingService.getSectionScore(business.id,getInvestorEligibilitySubsectionIds(companyGrowthStage).ID).pipe(tap(scores => {
          this.investorEligibilityScore =scores        
        }))

        this.investorPreparednessScore$ = this._businessMatchingService.getSectionScore(business.id,INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(scores => {
          this.investorPreparednessScore =scores        
        }))      
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
            this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));  

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

  connect(id: number) {
    this.connectWithCompany$ = this._businessMatchingService.connectWithCompany(id).pipe(
      tap(() => { 
        this._feedBackService.success('Connected with company successfully.');
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(this.currentPage, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));      
      })
    );
  }
}
