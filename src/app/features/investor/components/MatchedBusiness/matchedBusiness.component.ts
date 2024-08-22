import { Component } from '@angular/core';
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { AssessmentSummaryComponent } from "../../../../shared/components/assessment-summary/assessment-summary.component";
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewSectionComponent } from "../../../../shared/components/overview-section/overview-section.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";
import { OverviewComponent } from '../dashboard/overview/overview.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InterestingBusinesses, MatchedBusiness } from '../../../../shared/interfaces';
import { inject } from '@angular/core';
import { BusinessAndInvestorMatchingService } from '../../../../shared/business/services/busines.and.investor.matching.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { MobileNumber, UserMobileNumbersIssues } from '../../../auth/interfaces/auth.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FeedbackService } from '../../../../core';
import { CompanyResponse, GrowthStage } from '../../../organization/interfaces';
import { getInvestorEligibilitySubsectionIds, IMPACT_ASSESMENT_SUBSECTION_IDS, INVESTOR_PREPAREDNESS_SUBSECTION_IDS, Score } from '../../../../shared/business/services/onboarding.questions.service';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { SubMissionStateService, UserSubmissionResponse } from '../../../../shared';
import { RemoveQuotesPipe } from "../../../../shared/pipes/remove-quotes.pipe";

@Component({
  selector: 'app-matched-business',
  standalone: true,
  imports: [
    AdvertisementSpaceComponent,
    AssessmentSummaryComponent,
    MatIcon,
    NavbarComponent,
    OverviewSectionComponent,
    SchedulesSectionComponent,
    OverviewComponent,
    CardComponent,
    CommonModule,
    AlertComponent,
    DialogModule,
    ReactiveFormsModule,
    ModalComponent,
    RemoveQuotesPipe
],
  templateUrl: './matchedBusiness.component.html',
  styleUrl: './matchedBusiness.component.scss'
})


export class MatchedBusinessComponent {
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  visible = false;
  matchedBusinesses: MatchedBusiness[] = []
  selectedMatchedBusiness: MatchedBusiness | null = null;
  private _company = inject(CompanyHttpService)
  private _submissionStateService = inject(SubMissionStateService)

  markAsInteresting$ = new Observable<unknown>()
  interestingBusinesses: InterestingBusinesses[] = [];
  companyDetails: CompanyResponse | undefined;

  table: boolean = true

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res }));
  private _feedBackService = inject(FeedbackService);
  cancelInterestWithCompany$ = new Observable<unknown>;

  decline: boolean  =  false;

  companyDetails$ = new Observable<unknown>()


  investorEligibilityScore: number = 0;
  investorPreparednessScore: number = 0;


  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ =  new Observable<unknown>()



  impactElementAnswers : UserSubmissionResponse[] = [];
  

  esgSubmissions$ = this._submissionStateService.getEsgSubmissionsPerSection().pipe(tap(submissions => {
    this.impactElementAnswers = submissions
  }))


  showDialog() {
    this.visible = true;
  }

  trackByIndex(index: number): number {
    return index;
  }



  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;

    const companyGrowthStage = GrowthStage[business.growthStage as keyof typeof GrowthStage];
     //get the company details
    this.companyDetails$ = this._company.getSingleCompany(business.id).pipe(
      tap(res => {
        this.companyDetails = res

        //Get the scores
        this.investorEligibilityScore$ = this._businessMatchingService.getSectionScore(business.id,getInvestorEligibilitySubsectionIds(companyGrowthStage).ID).pipe(tap(scores => {
          this.investorEligibilityScore =scores.score        
        }))

        this.investorPreparednessScore$ = this._businessMatchingService.getSectionScore(business.id,INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(scores => {
          this.investorPreparednessScore =scores.score        
        }))      
      })
    )
  }







  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => {
        this._feedBackService.success('Company marked as interesting successfully.');
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => { this.interestingBusinesses = res; })
        );
      })
    );
  }

  hideDetails(): void {
    this.table = true
    this.selectedMatchedBusiness = null;
  }

  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
    tap(res => { this.interestingBusinesses = res; })
  );

  private _authStateService = inject(AuthStateService);
  issue = UserMobileNumbersIssues;
  signalsService = inject(SignalsService);
  private _fb = inject(FormBuilder);
  savephoneNumber$ = new Observable<any>();
  phoneNumberPull$ = new Observable<any>();

  phoneUpdateForm = this._fb.group({
    field: ['', [
      Validators.required,
    ]]
  })

  showalert() {
    this.signalsService.showDialog.set(true)
  }

  savePhoneNumber() {
    const field = (this.phoneUpdateForm.value?.field) ?? '';
    if (this.signalsService.actionBody().issue == this.issue.EMPTY) {
      this.savephoneNumber$ = this._authStateService.saveUserPhoneNumberAddedStatus(field).pipe(tap(res => {
        return res
      }))

    } else if (this.signalsService.actionBody().issue == this.issue.UNVERIFIED) {
      const mobileNumbers: MobileNumber[] = JSON.parse(sessionStorage.getItem('mobile_numbers') ?? JSON.stringify([]))
      if (mobileNumbers.length) {
        this.savephoneNumber$ = this._authStateService.verifyPhoneNumber(field, mobileNumbers.at(0)?.phoneNo ?? '').pipe(tap(res => {
          return res
        }))

      }
    }
  }

  cancelInterest(businessId: number): void {
    this.decline = true
    // this.cancelInterestWithCompany$ = this._businessMatchingService
    // .cancelInterestWithCompany(businessId).pipe(
    //   tap(() => {
    //     this._feedBackService.success('Interest cancelled successfully.');
    //     this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));     
    //     this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(tap(res => {this.interestingBusinesses = res;}));   
    //   })
    // );
  }


  ngOnChanges(): void {
    this.phoneNumberPull$ = this._authStateService.checkPhoneNumberStatus().pipe(tap((res: UserMobileNumbersIssues) => {
      this.signalsService.showInAppAlert.set(res !== UserMobileNumbersIssues.VERIFIED);
      if (res === UserMobileNumbersIssues.UNVERIFIED)
        this.signalsService.actionBody.set({ issue: UserMobileNumbersIssues.UNVERIFIED, command: 'Verify', message: 'Please Verify your phone number', title: 'Action Required' })
    }));
  }


}
