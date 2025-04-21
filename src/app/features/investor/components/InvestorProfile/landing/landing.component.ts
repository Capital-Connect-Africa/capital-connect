import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  RegistrationStructure, EsgFocusAreaOptions, InvestmentStructureOptions, InvestorTypeOptions, BusinessGrowthStageOptions, UseOfFundsOptions,
  InvestorProfile
} from '../../../../../shared/interfaces/Investor';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, Observable, tap } from 'rxjs';
import { InvestorScreensService } from '../../../services/investor.screens.service';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../../core';
import { CountriesService } from '../../../../../shared/services/countries.service';
import { Country } from '../../../../../shared/interfaces/countries';
import { SectorsService } from '../../../../sectors/services/sectors/sectors.service';
import { Sector, SubSector } from '../../../../../shared/interfaces/Investor';
import { Router } from '@angular/router';
import { TooltipDirective } from '../../../../../shared/directives/tooltip.directive';
import { NumberFormatDirective } from '../../../../../shared/directives/number-format.directive';
import { MatStepperModule } from '@angular/material/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';




@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule,TooltipModule, DropdownModule,AccordionModule, MultiSelectModule,FormsModule, ReactiveFormsModule, TooltipDirective,NumberFormatDirective,MatStepperModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _feedbackService = inject(FeedbackService)
  private _screenService = inject(InvestorScreensService)
  private _countries = inject(CountriesService)
  private _sectorService = inject(SectorsService)
  private _router = inject(Router)
  noMaxFunding$: Observable<boolean> | undefined;
  noMaxFund = false;

  current_details: number = 1
  cur_det: number[] = [1, 2, 3,4] 
  submit$ = new Observable<unknown>()
  esgFocusAreaOptions: EsgFocusAreaOptions[] = []
  countryOptions: Country[] = []
  investmentStructureOptions: InvestmentStructureOptions[] = []
  registrationStructureOptions: RegistrationStructure[] = []
  investorTypeOptions: InvestorTypeOptions[] = []
  businessGrowthStageOptions: BusinessGrowthStageOptions[] = []
  useOfFundsOptions: UseOfFundsOptions[] = []
  userEmail: string = ''
  userId: number = 0
  sectors: Sector[] = []
  subSectors: SubSector[] = []
  all_subsectors: SubSector[] = []
  investorProfile: InvestorProfile | null = null;
  investorProfileExists = false  

  tooltipVisible = false;
  tooltipText = '';
  tooltipStyle = {};


  selectedSectors: number[] = [];
  selectedSubSectors: number[] = [];
  sectorSubSectorsMap: { [sectorId: number]: number[] } = {};


  sectorId: number = 0

  message: { title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null = null;

  formGroup!: FormGroup;
  message$ = new Observable<{ title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>;


  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      const id = Number(userId)
      this.userId = id
    }
    this.message$ = this._feedbackService.message$;
    this.formGroup = this._formBuilder.group({
      userId: this.userId,
      headOfficeLocation: ['', Validators.required],
      organizationName: ['', Validators.required],
      fundDescription: ['', Validators.required],
      emailAddress: ['', Validators.required],
      url: ['', Validators.required],


      availableFunding: [0, Validators.required],
      minimumFunding: [0, Validators.required],
      maximumFunding: [0, Validators.required],


      differentFundingVehicles: [''],
      countriesOfInvestmentFocus: [[], Validators.required],
      useOfFunds: [[], Validators.required],    
      noMaximumFunding:[false],
      businessGrowthStages: [[], Validators.required],
      investorType: ['', Validators.required],
      investmentStructures: [[], Validators.required],
      esgFocusAreas: [[], Validators.required],
      registrationStructures: [[], Validators.required],
      sectors:[[],Validators.required],
      subSectors:[[],Validators.required]
    });


    this.investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
      this.investorProfile = investorProfile ;
    })  
  )


  }

  patchForm(investorProfile: InvestorProfile): void {
    this.selectedSubSectors = investorProfile.subSectors.map(sector => sector.id)
    this.selectedSectors = investorProfile.sectors.map(sector => sector.id)

    this.formGroup.patchValue({
      id: investorProfile.id,
      headOfficeLocation: investorProfile.headOfficeLocation,
      organizationName: investorProfile.organizationName,
      fundDescription: investorProfile.fundDescription,
      emailAddress: investorProfile.emailAddress,
      url: investorProfile.url,
      availableFunding: investorProfile.availableFunding,
      differentFundingVehicles: investorProfile.differentFundingVehicles,
      minimumFunding : investorProfile.minimumFunding,
      maximumFunding: investorProfile.maximumFunding,
      noMaximumFunding: investorProfile.noMaximumFunding,
      investorType: investorProfile.investorType,
      countriesOfInvestmentFocus: investorProfile.countriesOfInvestmentFocus,
      useOfFunds: investorProfile.useOfFunds,
      businessGrowthStages: investorProfile.businessGrowthStages,
      investmentStructures: investorProfile.investmentStructures,
      esgFocusAreas: investorProfile.esgFocusAreas,
      registrationStructures: investorProfile.registrationStructures,
      sectors:this.selectedSectors,
      subSectors:this.selectedSubSectors
    });


    if (investorProfile.investor) {
      this.formGroup.get('investor')?.patchValue(investorProfile.investor);
    }
  }


  onSubmit(): void { 
    this.formGroup.value.subSectors = [...this.selectedSubSectorIds1]

    if (this.investorProfile) {
      this.formGroup.value.minimumFunding =  Number(this.formGroup.value.minimumFunding)
      this.formGroup.value.maximumFunding =  Number(this.formGroup.value.maximumFunding)
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        if(this.noMaxFund){
          formData.maximumFunding = 0
        }
        this.submit$ = this._screenService.updateInvestorProfile(formData,this.investorProfile.id).pipe(
          tap(res => {
            this._feedbackService.success("Investor Profile Added Sucessfully, Proceed To Add Contact Persons")
            this._router.navigate(['/investor/contact-person']);
          }),
        )

      }
    } 
    else {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        this.submit$ = this._screenService.createInvestorProfile(formData).pipe(
          tap(res => {
            this._feedbackService.success("Investor Profile Updated Sucessfully,  Proceed To Update Contact Persons")
            this._router.navigate(['/investor/contact-person']);
          }),
          catchError((error: any) => {
            this._feedbackService.error('Error Adding Investor Profile.', error);
            return of(null);
          }),
        )

      }
    }
  }



  setNextDetails() {
    this.current_details = this.current_details + 1
  }

  setPrevDetails() {
    if (this.current_details != 1) {
      this.current_details = this.current_details - 1
    }
  }

  toggleSectorSelection(sectorId: number): void {
    const index = this.selectedSectors.indexOf(sectorId);
    if (index > -1) {
      this.selectedSectors.splice(index, 1);
      const associatedSubSectorIds = this.sectorSubSectorsMap[sectorId] || [];
      this.selectedSubSectors = this.selectedSubSectors.filter(subSectorId => !associatedSubSectorIds.includes(subSectorId));
      delete this.sectorSubSectorsMap[sectorId];
    } else {
      this.selectedSectors.push(sectorId);
      this.loadSubSectors(sectorId);
    }
  }

  removeAssociatedSubSectors(sectorId: number): void {
    const subSectorIdsToRemove = this.sectorSubSectorsMap[sectorId] || [];
    this.selectedSubSectors = this.selectedSubSectors.filter(id => !subSectorIdsToRemove.includes(id));
    delete this.sectorSubSectorsMap[sectorId];
  }

  getSubSectorNameById(id: number): string | undefined {
    const subSector = this.all_subsectors.find(sub => sub.id === id);
    return subSector ? subSector.name : undefined;
  }

  removeSector(sectorId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleSectorSelection(sectorId);
  }

  getSubSectorName(subSectorId: number): string {
    const subSector = this.subSectors.find(s => s.id === subSectorId);
    return subSector ? subSector.name : '';
  }

  removeSubSectorsForSector(sectorId: number): void {
    this.subSectors.forEach(subSector => {
      if (subSector.id === sectorId) {
        const index = this.selectedSubSectors.indexOf(subSector.id);
        if (index > -1) {
          this.selectedSubSectors.splice(index, 1);
        }
      }
    });
  }

  getSelectedSubSectorNames(): string[] {
    return this.selectedSubSectors
      .map(id => this.subSectors.find(subSector => subSector.id === id)?.name)
      .filter(name => name !== undefined) as string[];
  }

  removeSubSector(subSectorId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleSubSectorSelection(subSectorId);
  }

  toggleSubSectorSelection(subSectorId: number): void {
    const index = this.selectedSubSectors.indexOf(subSectorId);
    if (index > -1) {
      this.selectedSubSectors.splice(index, 1);
    } else {
      this.selectedSubSectors.push(subSectorId);
    }
  }

  updateSelectedSubSectorsForSector(sectorId: number): void {
    const associatedSubSectors = this.sectorSubSectorsMap[sectorId] || [];
    this.selectedSubSectors = associatedSubSectors;
  }

  isSectorSelected(sectorId: number): boolean {
    return this.selectedSectors.includes(sectorId);
  }

  isSubSectorSelected(subSectorId: number): boolean {
    return this.selectedSubSectors.includes(subSectorId);
  }


  loadSubSectors(sectorId: number): void {
    this.subSectors$ = this._sectorService.getSubSectorOfaSector(sectorId).pipe(tap(subSectors => {
      this.subSectors = subSectors
      this.all_subsectors = [...this.all_subsectors, ...subSectors];
      this.sectorSubSectorsMap[sectorId] = subSectors.map(subSector => subSector.id);
    }))
  }


  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countryOptions = countries
  }))

  registrationStructureOptions$ = this._screenService.getRegistrationStructures().pipe(tap(registrationStructureOptions => {
    this.registrationStructureOptions = registrationStructureOptions
  }))


  useOfFundsOptions$ = this._screenService.getUseOfFunds().pipe(tap(useOfFunds => {
    this.useOfFundsOptions = useOfFunds
  }))


  businessGrowthStageOptions$ = this._screenService.getStages().pipe(tap(stages => {
    this.businessGrowthStageOptions = stages
  }))



  investmentStructureOptions$ = this._screenService.getInvestmentStructures().pipe(tap(structures => {
    this.investmentStructureOptions = structures
  }))


  esgFocusAreaOptions$ = this._screenService.getEsgFocusAreas().pipe(tap(structures => {
    this.esgFocusAreaOptions = structures
  }))

  sectors$ = this._sectorService.getAllSectors().pipe(tap(sectors => {
    this.sectors = sectors
  }))

  subSectors$ = this._sectorService.getSubSectorOfaSector(this.sectorId).pipe(tap(sectors => {
    this.subSectors = sectors
  }))

  

  investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
    this.investorProfile = investorProfile || null;
    this.patchForm(investorProfile);
  }))

  investorTypeOptions$ = this._screenService.getInvestorTypes().pipe(tap(investorTypes => {
    this.investorTypeOptions = investorTypes
  }))


  showTooltip(event: MouseEvent, description: string): void {
    this.tooltipText = description;
    this.tooltipStyle = {
      top: `${event.clientY - 380}px`,
      left: `${event.clientX + 100}px`
    };
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  activeIndex: number = 0;
  selectedSectorsObjects!:Sector[]
  selectedSubSectorObjects!:String[]


  onSectorChange() {
   this.selectedSectorsObjects = this.getSelectedSectors(this.formGroup.value.sectors)
  }

  selectedSubSectorIds1: Set<number> = new Set();
  onSubSectorChange(){
     this.selectedSubSectorObjects = this.getSelectedSubSectors(this.formGroup.value.subSectors)
     this.selectedSubSectorIds1 = new Set([...this.selectedSubSectorIds1, ...this.formGroup.value.subSectors]);
     this.formGroup.value.subSectors = []
  }

  getSubSectors(sectorId: number) {
    return this.subSectors[sectorId] || [];
  }

  getSectorName(sectorId: number): string {
    const sector = this.sectors.find(s => s.id === sectorId);
    return sector ? sector.name : '';
  }


  getSelectedSectors(sectorIds: number[]): Sector[] {
    return sectorIds
      .map(sectorId => this.sectors.find(s => s.id === sectorId))
      .filter((sector): sector is Sector => !!sector); 
  }



  getSelectedSubSectors(sectorIds: number[]): string[] {
    return sectorIds
      .map(sectorId => {
        const subSector = this.subSectors.find(s => s.id === sectorId);
        return subSector ? subSector.name : null; 
      })
      .filter((name): name is string => !!name); 
  }
  

  activeAccordionIndex: number | null = null; 
  selectedSubSectorIds: number[] = []; 


  handleSubSectorChange(event: any): void {
    const currentSelectedIds: number[] = event.value;
    this.selectedSubSectorIds.push(...currentSelectedIds);
  }


  onAccordionOpen(sectorId: number): void {
    this.activeAccordionIndex = this.activeAccordionIndex === sectorId ? null : sectorId;
    this.loadSubSectors(sectorId)
    this.activeAccordionIndex ? this.activeAccordionIndex: null

    const tabs = document.querySelectorAll('.p-toggleable-content');
    tabs.forEach((tab, index) => {
        const isHidden = index !== this.activeAccordionIndex;
        tab.setAttribute('aria-hidden', isHidden.toString());
    });
  }

  getSubSectorsBySectorId(sectorId: number): any[] {
    return this.subSectors.filter(subSector => subSector.id === sectorId);
  }

    
  
}
