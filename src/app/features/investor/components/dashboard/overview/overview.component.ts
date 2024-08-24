import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY } from "rxjs";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../../shared/business/services/busines.and.investor.matching.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness } from '../../../../../shared/interfaces';
import { FeedbackService } from '../../../../../core';
import { AngularMaterialModule } from '../../../../../shared';
import { CompanyHttpService } from '../../../../organization/services/company.service';
import { CompanyResponse, GrowthStage } from '../../../../organization/interfaces';
import { BusinessOnboardingScoringService } from '../../../../../shared/services/business.onboarding.scoring.service';
import { Score } from '../../../../../shared/business/services/onboarding.questions.service';
import { getInvestorEligibilitySubsectionIds } from '../../../../../shared/business/services/onboarding.questions.service';
import { INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from '../../../../../shared/business/services/onboarding.questions.service';
import { IMPACT_ASSESMENT_SUBSECTION_IDS } from '../../../../../shared/business/services/onboarding.questions.service';
import { Router } from '@angular/router';
import { MatchMakingStats } from '../../../../../shared/interfaces';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSectionComponent,
    CardComponent,
    ModalComponent,
    AngularMaterialModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _router = inject(Router)
  visible = false;
  currentModal = '';
  selectedBusiness: InterestingBusinesses | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;


  matchMakingStats: MatchMakingStats | undefined 
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
  

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res  }));
  matchMakingStats$ = this._businessMatchingService.getMatchMakingStatistics().pipe(tap(res => {
    this.matchMakingStats = res as MatchMakingStats
  }))



  showDialog(current_modal: string) {
    if(current_modal === 'matched_businesses' ){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'interesting_businesses'){
      this._router.navigate(['/investor/interesting-businesess']);
    }else if(current_modal === 'connected_businesses'){
      this._router.navigate(['/investor/connected-businesess']);
    }
    else if(current_modal === 'rejected_businesses'){
      this._router.navigate(['/investor/rejected-businesess']);
    }

    // this.visible = true
    // this.table =true
    // this.currentModal = current_modal;
    // this.selectedBusiness = null;
    // this.selectedMatchedBusiness = null;
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



  getModalTitle(): string {
    switch (this.currentModal) {
      case 'connected_businesses':
        return 'Connected Businesses';
      case 'matched_businesses':
        return 'Matched Businesses';
      case 'interesting_businesses':
        return 'Interesting Businesses';
      case 'rejected_businesses':
        return 'Declined Businesess'
      default:
        return '';
    }
  }

  getModalHelperText(): string {
    switch (this.currentModal) {
      case 'connected_businesses':
        return 'You have connected with these businesses';
      case 'matched_businesses':
        return `You had a 100% Matching to ${this.matchedBusinesses.length} Businesses`;
      case 'interesting_businesses':
        return 'Businesess Interested In';
      case 'rejected_businesses':
        return 'You have Declined these businesses. You can review them and reconsider them as businesses of interest';
      default:
        return '';
    }
  }

  get modalData() {
    switch (this.currentModal) {
      case 'connected_businesses':
        return this.connectedBusinesses;
      case 'matched_businesses':
        return this.matchedBusinesses;
      case 'interesting_businesses':
        return this.interestingBusinesses;
      case 'rejected_businesses':
        return this.rejectedBusinesses;
      default:
        return [];
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

 

  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.');

        this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));     
    
      })        
    );
  }

  connect(id: number) {
    this.connectWithCompany$ = this._businessMatchingService.connectWithCompany(id).pipe(
      tap(() => { 
        this._feedBackService.success('Connected with company successfully.');
        this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));       
      })
    );
  }
}
