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
import { Observable, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { MobileNumber, UserMobileNumbersIssues } from '../../../auth/interfaces/auth.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FeedbackService } from '../../../../core';
import { CompanyResponse, GrowthStage } from '../../../organization/interfaces';
import { CONNECTED_COMPANIES_QUESTION_IDS, getInvestorEligibilitySubsectionIds, IMPACT_ASSESMENT_SUBSECTION_IDS, INVESTOR_PREPAREDNESS_SUBSECTION_IDS, Score, Scoring } from '../../../../shared/business/services/onboarding.questions.service';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { GeneralSummary, SubMissionStateService, UserSubmissionResponse } from '../../../../shared';
import { RemoveQuotesPipe } from "../../../../shared/pipes/remove-quotes.pipe";
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Country } from '../../../../shared/interfaces/countries';
import { Sector, SubSector } from '../../../sectors/interfaces';
import { EsgFocusAreaOptions, InvestmentStructureOptions, RegistrationStructure, UseOfFundsOptions } from '../../../../shared/interfaces/Investor';
import { CountriesService } from '../../../../shared/services/countries.service';
import { SectorsService } from '../../../sectors/services/sectors/sectors.service';
import { InvestorScreensService } from '../../services/investor.screens.service';
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { TableModule } from 'primeng/table';


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
    MultiSelectModule, ReactiveFormsModule,DropdownModule,TableModule
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
  investorEligibilityScore: string = '0';
  investorPreparednessScore: string = '0';
  impactAssessmentScore: string = '0';
  submissions: UserSubmissionResponse[] = []
  preparednessScore = parseFloat(this.investorPreparednessScore);
  InvestorPreparednessgeneralSummary: GeneralSummary | undefined;
  InvestorEligibilitygeneralSummary: GeneralSummary | undefined;
  eligibilityScore: number = 0;
  investmentStructureOptions: InvestmentStructureOptions[] = []
  useOfFundsOptions: UseOfFundsOptions[] = []
  esgFocusAreaOptions: EsgFocusAreaOptions[] = []


  

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
  private _scoringService = inject(BusinessOnboardingScoringService);

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
  userResponses$ = new Observable<unknown>()
  savephoneNumber$ = new Observable<unknown>();
  phoneNumberPull$ = new Observable<unknown>();
  searchCriteria$ = new Observable<unknown>()
  subSectors$ = new Observable<SubSector[]>()
  public scoring$ = new Observable<Scoring>;
  submissions$ = new Observable<UserSubmissionResponse[]>
  investorEligibilityScore$ = new Observable<unknown>()
  investorPreparednessScore$ =  new Observable<unknown>()
  impactAssessmentScore$ = new Observable<unknown>()
  investorPreparednessGeneralSummary$ = new Observable<GeneralSummary>()
  investorEligibilityGeneralSummary$ = new Observable<GeneralSummary>()
  downloadCSV$ = new Observable<Blob>

  useOfFunds: string[] = [];

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

  useOfFundsOptions$ = this._screenService.getUseOfFunds().pipe(tap(useOfFunds => {
    this.useOfFundsOptions = useOfFunds
  }))

  investmentStructureOptions$ = this._screenService.getInvestmentStructures().pipe(tap(structures => {
    this.investmentStructureOptions = structures
  }))

  esgFocusAreaOptions$ = this._screenService.getEsgFocusAreas().pipe(tap(structures => {
    this.esgFocusAreaOptions = structures
  }))



  // subSectors$ = this._sectorService.getSubSectorOfaSector(1).pipe(tap(sectors => {
  //   this.subSectors = sectors
  // }))

  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countries = countries
  }))

  registrationStructureOptions$ = this._screenService.getRegistrationStructures().pipe(tap(registrationStructureOptions => {
    this.registrationStructures = registrationStructureOptions
  }))

 

  constructor(private fb: FormBuilder) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
      reasons:[[]]
    });
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      countries: [[]],
      businessSectors: [[]],
      businessSubsectors: [[]],
      registrationStructures: [[]],
      yearsOfOperation: [''],
      growthStages: [[]],
      numberOfEmployees: [''],
      fullTimeBusiness: [false],
      fundsNeeded:[''],
      investmentStructures:[[]],
      useOfFunds:[[]],
      esgFocusAreas:[[]]
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

 
  private removeEmptyFields(obj: any): any {
    return Object.entries(obj)
      .filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'boolean' || typeof value === 'number') return true;
        return true;
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }
  

  onSearch() {
    const formValue = { ...this.searchForm.value };
    formValue.sectors = this.selectedSectors;
    formValue.subSectors = this.selectedSubSectors;
  
    if (formValue.fullTimeBusiness === false) {
      delete formValue.fullTimeBusiness;
    }
  
    const searchCriteria = this.removeEmptyFields(formValue);

    this.searchCriteria$ = this._businessMatchingService.postSearchCriteria(searchCriteria).pipe(
      tap(res => {
        this.matchedBusinesses = res;
        this.advanced_Search = false;
        this.searchForm.reset();
        this.searchForm.markAsPristine();
        this.searchForm.markAsUntouched();
        this.selectedSectors = []
        this.selectedSubSectors = []
      })
    );
  }
  

  isSectorSelected(sector: string): boolean {
    return this.selectedSectors.includes(sector);
  }

  isSubSectorSelected(subSector: string): boolean {
    return this.selectedSubSectors.includes(subSector);
  }


  onResetSearch() {
    this.searchForm.reset();
    this.searchForm.markAsPristine();
    this.searchForm.markAsUntouched();
    this.sectors = []
    this.subSectors  = []
    this.selectedSectors = []
    this.selectedSubSectors = []
    this.matchedCompanies$ = this._businessMatchingService.getMatchedCompanies();
  }

  showSearch(){
    this.advanced_Search = true
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





  toggleSector(sector: any): void {
    const index = this.selectedSectors.indexOf(sector.name);
    if (index > -1) {
      this.selectedSectors.splice(index, 1);
    } else {
      this.selectedSectors.push(sector.name);
      // this.loadSubSectors(sector.id); // Fetch subsectors based on selected sector ID
      this.subSectors$ = this._sectorService.getSubSectorOfaSector(sector.id).pipe(tap(sectors => {
        this.subSectors = sectors

      }))

    }
  }


  toggleSubSector(subSector: any): void {
    const index = this.selectedSubSectors.indexOf(subSector.name);
    if (index > -1) {
      this.selectedSubSectors.splice(index, 1);
    } else {
      this.selectedSubSectors.push(subSector.name);
    }
  }




  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;

    const companyGrowthStage = this.getGrowthStageFromString(business.growthStage);


    //get the company details
   this.companyDetails$ = this._company.getSingleCompany(business.id).pipe(
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


  downloadCSV(status:string){this.downloadCSV$ = this._businessMatchingService.matchMakingCsv(status).pipe(tap(res=>{ })) }
} 
