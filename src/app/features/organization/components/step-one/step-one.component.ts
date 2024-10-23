import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { Company, CompanyInput, CompanyResponse } from '../../interfaces';
import { UserCompanyService } from "../../../../core/services/company/user.company.service";
import { Sector, Segment, SubSector } from '../../../sectors/interfaces';
import { CountriesService } from '../../../../shared/services/countries.service';
import { Country } from '../../../../shared/interfaces/countries';
import { CompanyStateService } from '../../services/company-state.service';
import { SectorsService } from '../../../sectors/services/sectors/sectors.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule,MultiSelectModule],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepOneComponent implements OnChanges {
  private _userCompany = inject(UserCompanyService)
  private _fb = inject(FormBuilder)
  private _countries = inject(CountriesService)
  private _orgStateService = inject(OrganizationOnboardService);
  private _companyStateService = inject(CompanyStateService);
  private _sectorsService = inject(SectorsService);



  countries: Country[] = []

  @Input() companyToBeEdited!: CompanyResponse

  sectors$: Observable<Sector[]> = this._orgStateService.fetchSectors$.pipe(tap(sectors => {
    this.sectors = sectors;
    if (!this._currentCompany) {
      this.businessSubsectorCtrl?.disable();
      this.businessSubsectorCtrl?.reset();
    }
  }));
  ngOnInit(): void {
    if (this._currentCompany?.businessSector) this._initSubSector(this._currentCompany?.businessSector)
    this._orgStateService.step1isValid.set(this.stepOneForm.valid);
  }
  subsectors$!: Observable<SubSector[]>
  segments$!: Observable<Segment[]>


  private _currentCompanyData: CompanyInput = this._orgStateService.companyInput;

  private _currentCompany = this._companyStateService.currentCompany;
  userCompany: Company = this._currentCompany;

  stepOneForm: FormGroup = this._fb.group({
    name: [(this._currentCompanyData?.name || this._currentCompany?.name) || '', Validators.required],
    country: [(this._currentCompanyData?.country || this._currentCompany?.country) || 'Kenya', Validators.required],
    segments: [(this._currentCompanyData?.segments || this._currentCompany?.segments) || [], Validators.required],
    businessSector: [(this._currentCompanyData?.businessSector || this._currentCompany?.businessSector) || '', Validators.required],
    businessSubsector: [(this._currentCompanyData?.businessSubsector || this._currentCompany?.businessSubsector) || '', Validators.required],
    productsAndServices: [(this._currentCompanyData?.productsAndServices || this._currentCompany?.productsAndServices) || '', Validators.required]
  });

  stepOneForm$ = this.stepOneForm.valueChanges.pipe(tap(vals => {
    this._orgStateService.step1isValid.set(this.stepOneForm.valid)
    if (this.stepOneForm.valid) {
      this._orgStateService.updateCompanyInput(vals)
    }
  }));



  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countries = countries
  }))

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyToBeEdited"] && changes["companyToBeEdited"].currentValue) {
      this.stepOneForm.patchValue({
        name: this._currentCompanyData.name.length ? this._currentCompanyData.name : this.companyToBeEdited.name,
        country: this._currentCompanyData.country.length ? this._currentCompanyData.country : this.companyToBeEdited.country,
        segments: this._currentCompanyData.segments.length ? this._currentCompanyData.segments : this.companyToBeEdited.segments,
        businessSector: this._currentCompanyData.businessSector.length ? this._currentCompanyData.businessSector : this.companyToBeEdited.businessSector,
        businessSubsector: this._currentCompanyData.businessSubsector.length ? this._currentCompanyData.businessSubsector : this.companyToBeEdited.businessSubsector,
        productsAndServices: this._currentCompanyData.productsAndServices ? this._currentCompanyData.productsAndServices : this.companyToBeEdited.productsAndServices,
      });
      const formVal = this.stepOneForm.value;
      this._initSubSector(formVal.businessSector)
    }
  }

  private _initSubSector(sector: string) {
    this.sectors$ = this._orgStateService.fetchSectors$.pipe(tap(sectors => {
      this.sectors = sectors;
      const sectorId = sectors.find(s => s.name == sector)?.id;
      if (sectorId) {
        this.subsectors$ = this._orgStateService.fetchSpecificSubSectors(Number(sectorId)).pipe(tap(subsectors => {
          this.subsectors = subsectors
          const subSectorId = subsectors.find(s => s.name == this.stepOneForm.value.businessSubsector)?.id;
          if (subSectorId) {
            this.segments$ = this._sectorsService.getSegmentsOfaSubSector(Number(subSectorId)).pipe(tap(res => {
              this.segments = res
            }))
          }

        }))
      }
    }));
  }




  onSectorSelected(target: EventTarget | null) {
    this.businessSubsectorCtrl?.reset();
    this.businessSubsectorCtrl?.enable();
    const sectorId = Number(this.sectors.find(sector => sector.name === (target as any).value)?.id) as number;
    this.subsectors$ = this._orgStateService.fetchSpecificSubSectors(sectorId).pipe(tap(subsectors => {
      this.subsectors = subsectors
    }))
  }

  onSubSectorSelected(target: EventTarget | null) {
    this.segmentCtrl?.reset();
    this.segmentCtrl?.enable();
    const subSectorId = Number(this.subsectors.find(subsector => subsector.name === (target as any).value)?.id) as number;
    this.segments$ = this._sectorsService.getSegmentsOfaSubSector(Number(subSectorId)).pipe(tap(res => {
      this.segments = res
    }))
  }

  get businessSubsectorCtrl() {
    return this.stepOneForm.get('businessSubsector')
  }

  get segmentCtrl() {
    return this.stepOneForm.get('segments')
  }

  sectors: Sector[] = [];
  subsectors: SubSector[] = [];
  segments!: Segment[];

  productsAndServices: string[] = ['FMCG', 'Fintech', 'Software', 'Consulting', 'Logistics', 'Telecommunications', 'Biotechnology', 'Construction', 'Energy', 'Tourism'];

  company$ = this._userCompany.companySrc$.pipe(tap(company => {
    this.userCompany = company;
  }))


}
