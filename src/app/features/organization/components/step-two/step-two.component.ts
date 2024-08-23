import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared';
import { CompanyInput, CompanyResponse } from '../../interfaces';
import { CompanyHttpService } from '../../services/company.service';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, Input, SimpleChanges } from '@angular/core';
import { Choice } from '../../../business/interfaces/choice.interface';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MultiSelectModule, DropdownModule],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepTwoComponent {
  
  @Input() companyToBeEdited!: CompanyResponse

  private _fb = inject(FormBuilder)
  private _companyHttpService =inject(CompanyHttpService)
  private _orgStateService = inject(OrganizationOnboardService);


  private _currentCompanyData: CompanyInput = this._orgStateService.companyInput;


  esg_focus:Choice[] =[];
  use_of_funds:Choice[] =[];
  growth_stages:Choice[] =[];
  years_of_operation:Choice[] =[];
  number_of_employees:Choice[] =[];
  investment_structures:Choice[] =[];
  registration_structures:Choice[] =[];
  
  choices$ =this._companyHttpService.fetchQuestionChoices().pipe(tap(res =>{
    this.esg_focus =res.esg_focus;
    this.use_of_funds =res.use_of_funds;
    this.growth_stages =res.stage_of_growth;
    this.years_of_operation =res.years_of_operation
    this.number_of_employees =res.number_of_employees;
    this.investment_structures =res.investment_structures;
    this.registration_structures =res.registration_structure;
  }));

  stepTwoForm: FormGroup = this._fb.group({
    registrationStructure: [this._currentCompanyData.registrationStructure ?? '', Validators.required],
    yearsOfOperation: [this._currentCompanyData.yearsOfOperation ?? '', [Validators.required]],
    growthStage: [this._currentCompanyData.growthStage ?? '', Validators.required],
    numberOfEmployees: [this._currentCompanyData.numberOfEmployees ?? '', Validators.required],
    fullTimeBusiness: [this._currentCompanyData.fullTimeBusiness, Validators.required],
    esg_focus: [[], Validators.required],
    use_of_funds: [[], Validators.required],
    investment_ticket: ['', Validators.required],
    investiment_structure: [[], Validators.required],
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
