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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FeedbackService } from '../../../../core';
import { CompanyResponse, GrowthStage } from '../../../organization/interfaces';
import { getInvestorEligibilitySubsectionIds, IMPACT_ASSESMENT_SUBSECTION_IDS, INVESTOR_PREPAREDNESS_SUBSECTION_IDS, Score } from '../../../../shared/business/services/onboarding.questions.service';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { SubMissionStateService, UserSubmissionResponse } from '../../../../shared';
import { RemoveQuotesPipe } from "../../../../shared/pipes/remove-quotes.pipe";
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Country } from '../../../../shared/interfaces/countries';
import { Sector, SubSector } from '../../../sectors/interfaces';
import { RegistrationStructure } from '../../../../shared/interfaces/Investor';
import { CountriesService } from '../../../../shared/services/countries.service';
import { SectorsService } from '../../../sectors/services/sectors/sectors.service';
import { InvestorScreensService } from '../../services/investor.screens.service';



@Component({
  selector: 'app-matched-business',
  standalone: true,
  imports: [
    AdvertisementSpaceComponent, AssessmentSummaryComponent,
    MatIcon, NavbarComponent, OverviewSectionComponent,
    SchedulesSectionComponent, OverviewComponent,
    CardComponent, CommonModule,  AlertComponent,
    DialogModule, ReactiveFormsModule, ModalComponent,
    RemoveQuotesPipe, 
    MultiSelectModule, ReactiveFormsModule,DropdownModule
  ],
  templateUrl: './matchedBusiness.component.html',
  styleUrl: './matchedBusiness.component.scss'
})


export class MatchedBusinessComponent {
  matchedBusinesses: MatchedBusiness[] = []
  selectedMatchedBusiness: MatchedBusiness | null = null; 
  business__id: number = 0
  interestingBusinesses: InterestingBusinesses[] = [];
  userResponses: UserSubmissionResponse[] = [];
  declineReasons: String[] = [];
  companyDetails: CompanyResponse | undefined;
  investorEligibilityScore: number = 0;
  investorPreparednessScore: number = 0;
  impactElementAnswers: UserSubmissionResponse[] = [];
  issue = UserMobileNumbersIssues;

  countries: Country[] = []
  sectors: Sector[] = []
  subSectors: SubSector[] = []
  registrationStructures: RegistrationStructure[] = []
  yearsOfOperation: String[] = []
  growthStages: String[] = []
  numberOfEmployees: String[] = []
  selectedSectors: string[] = [];
  selectedSubSectors: string[] = [];

  

  //services
  private _company = inject(CompanyHttpService)
  private _submissionStateService = inject(SubMissionStateService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _feedBackService = inject(FeedbackService);
  private _authStateService = inject(AuthStateService); 
  signalsService = inject(SignalsService);
  private _fb = inject(FormBuilder);
  private _companyHttpService =inject(CompanyHttpService)
  private _screenService = inject(InvestorScreensService)
  private _countries = inject(CountriesService)
  private _sectorService = inject(SectorsService)

  //booleans
  advanced_Search : boolean = false
  table: boolean = true
  decline: boolean = false;
  visible = false;

  //Forms
  declineForm!: FormGroup;
  searchForm!: FormGroup;
  
  //streams
  markAsInteresting$ = new Observable<unknown>()
  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res }));
  cancelInterestWithCompany$ = new Observable<unknown>();
  companyDetails$ = new Observable<unknown>()
  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ = new Observable<unknown>()
  userResponses$ = new Observable<unknown>()
  savephoneNumber$ = new Observable<unknown>();
  phoneNumberPull$ = new Observable<unknown>();
  searchCriteria$ = new Observable<unknown>()

  esgSubmissions$ = this._submissionStateService.getEsgSubmissionsPerSection().pipe(tap(submissions => {
    this.impactElementAnswers = submissions
  }))

  declineReasons$ = this._businessMatchingService.getDeclineReasons().pipe(tap(reasons => {
    this.declineReasons = reasons
  }))

  yearsOfOperation$ =this._companyHttpService.fetchCompanyYearsOfOperation().pipe(tap(res =>{
    this.yearsOfOperation = res as string[]
  }))

  growthStages$ =this._companyHttpService.fetchGrowthStages().pipe(tap((res: any) =>{
    this.growthStages = res as string[]
  }))

  numberOfEmployees$ =this._companyHttpService.fetchCompanyNumberOfEmployees().pipe(tap(res =>{
    this.numberOfEmployees =  res as string[]
  }))

  sectors$ = this._sectorService.getAllSectors().pipe(tap(sectors => {
    this.sectors = sectors
  }))

  subSectors$ = this._sectorService.getSubSectorOfaSector(1).pipe(tap(sectors => {
    this.subSectors = sectors
  }))

  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countries = countries
  }))

  registrationStructureOptions$ = this._screenService.getRegistrationStructures().pipe(tap(registrationStructureOptions => {
    this.registrationStructures = registrationStructureOptions
  }))

 

  constructor(private fb: FormBuilder) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
    });
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      countries: [[]],
      businessSectors: [[]],
      businessSubsectors: [[]],
      productsAndServices: [''],
      registrationStructures: [[]],
      yearsOfOperation: [''],
      growthStages: [[]],
      numberOfEmployees: [''],
      fullTimeBusiness: [false]
    });
  }

  phoneUpdateForm = this._fb.group({
    field: ['', [
      Validators.required,
    ]]
  })

 

  

  //Functions
  showDialog() {
    this.visible = true;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSearch() {
    this.searchForm.value.sectors = this.selectedSectors
    this.searchForm.value.subSectors = this.selectedSubSectors
    const searchCriteria = this.searchForm.value;

    this.searchCriteria$ = this._businessMatchingService.postSearchCriteria(searchCriteria).pipe(
      tap(res=>{
        this.matchedBusinesses = res
        this.advanced_Search = false
      })
    )
  }

  onResetSearch() {
    this.searchForm.reset();
    this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies();
  }

  showSearch(){
    this.advanced_Search = true
  }

  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;

    const companyGrowthStage = GrowthStage[business.growthStage as keyof typeof GrowthStage];
    //get the company details
    // this.companyDetails$ = this._company.getSingleCompany(business.id).pipe(
    //   tap(res => {
    //     this.companyDetails = res

    //     //Get the scores
    //     this.investorEligibilityScore$ = this._businessMatchingService.getSectionScore(business.id, getInvestorEligibilitySubsectionIds(companyGrowthStage).ID).pipe(tap(scores => {
    //       this.investorEligibilityScore = scores.score
    //     }))

    //     this.investorPreparednessScore$ = this._businessMatchingService.getSectionScore(business.id, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(scores => {
    //       this.investorPreparednessScore = scores.score
    //     }))

    //     //get the submissions
    //     this.userResponses$ = this._businessMatchingService.getSubmisionByIds(res.id, [16, 17, 21]).pipe(tap(responses => {
    //       this.userResponses = responses
    //     }))

    //   })
    // )
  }


  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => {
        this._feedBackService.success('Company marked as interesting successfully.');
      })
    );
  }

  hideDetails(): void {
    this.table = true
    this.selectedMatchedBusiness = null;
  }

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
            this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res }));

            this.declineForm.reset();
            this.declineForm.updateValueAndValidity();

            this.decline = false;
          })
        );
    }

  }

  ngOnChanges(): void {
    this.phoneNumberPull$ = this._authStateService.checkPhoneNumberStatus().pipe(tap((res: UserMobileNumbersIssues) => {
      this.signalsService.showInAppAlert.set(res !== UserMobileNumbersIssues.VERIFIED);
      if (res === UserMobileNumbersIssues.UNVERIFIED)
        this.signalsService.actionBody.set({ issue: UserMobileNumbersIssues.UNVERIFIED, command: 'Verify', message: 'Please Verify your phone number', title: 'Action Required' })
    }));
  }
  

}
