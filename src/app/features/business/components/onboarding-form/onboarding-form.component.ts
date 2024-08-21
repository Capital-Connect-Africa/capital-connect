import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { Choice } from '../../interfaces/choice.interface';
import { BusinessOnboardingService } from '../../services/business-profile/business.onboarding.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-onboarding-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './onboarding-form.component.html',
  styleUrl: './onboarding-form.component.scss'
})
export class OnboardingFormComponent {

  private _router =inject(Router);
  private _formBuilder =inject(FormBuilder);
  private _businessOnboardingService =inject(BusinessOnboardingService);

  esg_focus:Choice[] =[];
  use_of_funds:Choice[] =[];
  onboardingForm!:FormGroup; 
  investment_structures:Choice[] =[];

  submission$ =new Observable<any>

  ngOnInit(): void {
    this.onboardingForm=this._formBuilder.group({});
    this._createFormControls();
  }

  private _createFormControls(){
    this.onboardingForm.addControl('esg_focus', this._formBuilder.control([], Validators.required));
    this.onboardingForm.addControl('use_of_funds', this._formBuilder.control([], Validators.required));
    this.onboardingForm.addControl('investiment_ticket', this._formBuilder.control('', Validators.required));
    this.onboardingForm.addControl('investment_structures', this._formBuilder.control([], Validators.required));
  }

  choices$ =this._businessOnboardingService.getQuestionAnswers().pipe(tap(res =>{
    this.esg_focus =res.esg_focus;
    this.use_of_funds =res.use_of_funds;
    this.investment_structures =res.investment_structures;

  }));

  handleSubmit(){
    const formValues =this.onboardingForm.value;

  }

  goToDashboard(){
    this._router.navigateByUrl('/business');
  }
}
