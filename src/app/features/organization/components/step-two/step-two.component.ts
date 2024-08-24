import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared';
import { Company, CompanyInput, CompanyResponse } from '../../interfaces';
import { CompanyHttpService } from '../../services/company.service';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, Input, SimpleChanges } from '@angular/core';
import { Choice } from '../../../business/interfaces/choice.interface';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CompanyStateService } from '../../services/company-state.service';

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
  private _companyStateService =inject(CompanyStateService)


  private _currentCompanyData: CompanyInput = this._orgStateService.companyInput;
  private _savedCompanyData: Company =this._companyStateService.currentCompany
 

  esgFocus:string[] =[];
  useOfFunds:string[] =[];
  growthStages:string[] =[];
  yearsOfOperation:string[] =[];
  numberOfEmployees:string[] =[];
  investmentStructure:string[] =[];
  registrationStructures:string[] =[];

  private _defaultValues ={
    esg: this._currentCompanyData.esgFocusAreas.length >0?this._currentCompanyData.esgFocusAreas:this._savedCompanyData.esgFocusAreas,
    stages: this._currentCompanyData.growthStage? this._currentCompanyData.growthStage:this._savedCompanyData.growthStage,
    years: this._currentCompanyData.yearsOfOperation? this._currentCompanyData.yearsOfOperation:this._savedCompanyData.yearsOfOperation,
    employees: this._currentCompanyData.numberOfEmployees? this._currentCompanyData.numberOfEmployees:this._savedCompanyData.numberOfEmployees,
    registration: this._currentCompanyData.registrationStructure? this._currentCompanyData.registrationStructure:this._savedCompanyData.registrationStructure,
    investiment: this._currentCompanyData.investmentStructure.length? this._currentCompanyData.investmentStructure:this._savedCompanyData.investmentStructure,
    amount: this._currentCompanyData.fundsNeeded >0?this._currentCompanyData.fundsNeeded: this._savedCompanyData.fundsNeeded >0?this._savedCompanyData.fundsNeeded:'',
    funds: this._currentCompanyData.useOfFunds.length >0?this._currentCompanyData.useOfFunds: this._savedCompanyData.useOfFunds
  }

  choices$ =this._companyHttpService.fetchQuestionChoices().pipe(tap(res =>{
    this.esgFocus =res.esg_focus.map(({title}) =>title);
    this.useOfFunds =res.use_of_funds.map(({title}) =>title);
    this.growthStages =res.stage_of_growth.map(({title}) =>title);
    // @ts-ignore
    this.yearsOfOperation =res.years_of_operation;
    // @ts-ignore
    this.numberOfEmployees =res.number_of_employees;
    this.investmentStructure =res.investment_structures.map(({title}) =>title);
    this.registrationStructures =res.registration_structure.map(({title}) =>title);

  }));


  
  stepTwoForm: FormGroup = this._fb.group({
    fundsNeeded: [this._defaultValues.amount, Validators.required],
    registrationStructure: [this._defaultValues.registration, Validators.required],
    yearsOfOperation: [this._defaultValues.years, [Validators.required]],
    numberOfEmployees: [this._defaultValues.employees, Validators.required],
    investmentStructure: [this._defaultValues.investiment, Validators.required],
    growthStage: [this._defaultValues.stages, Validators.required],
    esgFocusAreas: [this._defaultValues.esg, Validators.required],
    useOfFunds: [this._defaultValues.funds, Validators.required],
    fullTimeBusiness: [this._currentCompanyData.fullTimeBusiness || this._savedCompanyData.fullTimeBusiness, Validators.required],
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
        investmentStructure: this._currentCompanyData.investmentStructure ? this._currentCompanyData.investmentStructure : this.companyToBeEdited.investmentStructure,
        esgFocusAreas: this._currentCompanyData.esgFocusAreas ? this._currentCompanyData.esgFocusAreas : this.companyToBeEdited.esgFocusAreas,
        fundsNeeded: this._currentCompanyData.fundsNeeded ? this._currentCompanyData.fundsNeeded : this.companyToBeEdited.fundsNeeded,
        useOfFunds: this._currentCompanyData.useOfFunds ? this._currentCompanyData.useOfFunds : this.companyToBeEdited.useOfFunds,
      });
    }
  }

}
