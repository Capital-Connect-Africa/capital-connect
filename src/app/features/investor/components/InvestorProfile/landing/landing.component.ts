import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
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


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, DropdownModule, MultiSelectModule, ReactiveFormsModule, TooltipDirective,NumberFormatDirective],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _httpClient = inject(HttpClient);
  private _feedbackService = inject(FeedbackService)
  private _screenService = inject(InvestorScreensService)
  private _countries = inject(CountriesService)
  private _sectorService = inject(SectorsService)
  private _router = inject(Router)

  current_details: number = 1
  cur_det: number[] = [1, 2, 3]
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
      availableFunding: [null, Validators.required],
      differentFundingVehicles: ['', Validators.required],
      countriesOfInvestmentFocus: [[], Validators.required],
      useOfFunds: [[], Validators.required],
      minimumFunding: ['', Validators.required],
      maximumFunding: ['', Validators.required],
      noMaximumFunding:[false],
      businessGrowthStages: [[], Validators.required],
      investorType: ['', Validators.required],
      investmentStructures: [[], Validators.required],
      esgFocusAreas: [[], Validators.required],
      registrationStructures: [[], Validators.required],
    });

    this.investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
      this.investorProfile = investorProfile ;
      this.patchForm(investorProfile);
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
    });


    if (investorProfile.investor) {
      this.formGroup.get('investor')?.patchValue(investorProfile.investor);
    }
  }


  onSubmit(): void { 
    this.formGroup.value.sectors = this.selectedSectors
    this.formGroup.value.subSectors = this.selectedSubSectors

    this.formGroup.value.minimumFunding = parseFloat(this.formGroup.value.minimumFunding.replace(/,/g, ''))
    this.formGroup.value.maximumFunding = parseFloat(this.formGroup.value.maximumFunding.replace(/,/g, ''))
    this.formGroup.value.availableFunding = parseFloat(this.formGroup.value.availableFunding.replace(/,/g, ''))
    this.formGroup.value.registrationStructures = [this.formGroup.value.registrationStructures]




    if (this.investorProfile) {
      this.formGroup.value.minimumFunding =  Number(this.formGroup.value.minimumFunding)
      this.formGroup.value.maximumFunding =  Number(this.formGroup.value.maximumFunding)
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        this.submit$ = this._screenService.updateInvestorProfile(formData,this.investorProfile.id).pipe(
          tap(res => {
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

  onSectorChange(selectedSectorId: number): void {
    this.updateSelectedSubSectorsForSector(selectedSectorId);
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
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 5}px`
    };
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }
}
