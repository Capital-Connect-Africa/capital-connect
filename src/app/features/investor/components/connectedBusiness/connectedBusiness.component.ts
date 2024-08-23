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
import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-connected-business',
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
    MatPaginatorModule,
  ],
  templateUrl: './connectedBusiness.component.html',
  styleUrl: './connectedBusiness.component.scss',
  providers: [PaginationService]
})
export class ConnectedBusinessComponent {
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _router = inject(Router)
  visible = false;
  currentModal = '';
  selectedBusiness: InterestingBusinesses | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;


  matchedBusinesses: MatchedBusiness[] = [];
  connectedBusinesses: ConnectedBusiness[] = [];
  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: ConnectedBusiness[] = [];

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

  table:boolean = true
  
  itemsPerPage: number = 8;
  currentPage: number = 0; // Start at 0 for Material paginator
  pageSize: number = 8;
  totalItems: number = 100; // Set total items
  


  dataSource = new MatTableDataSource<ConnectedBusiness>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(1,this.pageSize).pipe(
    tap(res => {
      this.connectedBusinesses = res;
      // this.totalItems = res.length;
      // this.dataSource.data = res;
      // this.dataSource.paginator = this.paginator;
    })
  );

  





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

  showDetails(business: InterestingBusinesses): void {
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
    this.table = !this.table
    this.selectedBusiness = business;
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
    this.cancelConnectWithCompany$ = this._businessMatchingService.cancelConnectWithCompany(businessId).pipe(
      tap(() => {
        this._feedBackService.success('Connection cancelled successfully.');
   
        this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(1,8).pipe(tap(res => {this.connectedBusinesses = res;})); 
       })
    );
  }

  cancelInterest(businessId: number): void {
    this.cancelInterestWithCompany$ = this._businessMatchingService
    .cancelInterestWithCompany(businessId).pipe(
      tap(() => {
        this._feedBackService.success('Interest cancelled successfully.');  
        this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(1,8).pipe(tap(res => {this.connectedBusinesses = res;}));
      })
    );
  }



  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.');    
        this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(1,8).pipe(tap(res => {this.connectedBusinesses = res;}));
      })        
    );
  }


  pageChange(event: PageEvent): void {
    console.log("The event is",event)

    this.currentPage = event.pageIndex; // Get the new page index
    console.log("The current page size is", this.currentPage)
    // console.log("The event page index is", event.pageIndex)

    this.pageSize = event.pageSize; // Update the page size
    // console.log("Event pageSize:", event.pageSize);

    this.pageSize = event.pageSize; // Get the new page size
    this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(this.currentPage + 1, this.pageSize).pipe(
      tap(res => {
        this.connectedBusinesses = res;
        console.log("The length of the returned items is", res.length)
        // this.totalItems = res.length;
      })
    );
  }

  connect(id: number) {
    this.connectWithCompany$ = this._businessMatchingService.connectWithCompany(id).pipe(
      tap(() => { 
        this._feedBackService.success('Connected with company successfully.');    
        this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies(1,8).pipe(tap(res => {this.connectedBusinesses = res;}));   
      })
    );
  }
}
