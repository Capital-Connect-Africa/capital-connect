import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { CompanyInput, CompanyResponse } from '../../interfaces';
import { CompanyHttpService } from '../../services/company.service';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepTwoComponent {

  private _fb = inject(FormBuilder)
  private _companyHttpService =inject(CompanyHttpService)
  private _orgStateService = inject(OrganizationOnboardService);

  @Input() companyToBeEdited!: CompanyResponse

  private _currentCompanyData: CompanyInput = this._orgStateService.companyInput;

  growthStages$ =this._companyHttpService.fetchGrowthStages().pipe(tap((res: any) =>{
    return res
  }))

  registrationStructures$ =this._companyHttpService.fetchRegistrationStructure().pipe(tap((res: any) =>{
    return res
  }))

  yearsOfOperation$ =this._companyHttpService.fetchCompanyYearsOfOperation().pipe(tap(res =>{
    return res
  }))

  numberOfEmployees$ =this._companyHttpService.fetchCompanyNumberOfEmployees().pipe(tap(res =>{
    return res
  }))

  stepTwoForm: FormGroup = this._fb.group({
    registrationStructure: [this._currentCompanyData.registrationStructure ?? '', Validators.required],
    yearsOfOperation: [this._currentCompanyData.yearsOfOperation ?? '', [Validators.required]],
    growthStage: [this._currentCompanyData.growthStage ?? '', Validators.required],
    numberOfEmployees: [this._currentCompanyData.numberOfEmployees ?? '', Validators.required],
    fullTimeBusiness: [this._currentCompanyData.fullTimeBusiness, Validators.required]
  });

  stepTwoForm$ = this.stepTwoForm.valueChanges.pipe(tap(vals => {
    this._orgStateService.step2isValid.set(this.stepTwoForm.valid)
    if (this.stepTwoForm.valid) {
      this._orgStateService.updateCompanyInput(vals);
    }
  }))

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyToBeEdited"] && changes["companyToBeEdited"].currentValue) {
      this.stepTwoForm.patchValue({
        registrationStructure: this._currentCompanyData.registrationStructure.length ? this._currentCompanyData.registrationStructure : this.companyToBeEdited.registrationStructure,
        yearsOfOperation: this._currentCompanyData.yearsOfOperation.length ? this._currentCompanyData.yearsOfOperation : this.companyToBeEdited.yearsOfOperation,
        growthStage: this._currentCompanyData.growthStage.length ? this._currentCompanyData.growthStage : this.companyToBeEdited.growthStage,
        numberOfEmployees: this._currentCompanyData.numberOfEmployees.length ? this._currentCompanyData.numberOfEmployees : this.companyToBeEdited.numberOfEmployees,
        fullTimeBusiness: this._currentCompanyData.fullTimeBusiness ? this._currentCompanyData.fullTimeBusiness : this.companyToBeEdited.fullTimeBusiness,
      });
    }
  }

}
