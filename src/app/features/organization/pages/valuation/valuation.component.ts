import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ValuationQuestion ,ValuationResponse} from './valuation.interface';
import { Observable } from 'rxjs';
import { ValuationHttpService } from '../../services/valuation.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.scss'],
  imports: [ ReactiveFormsModule, CommonModule, DropdownModule, InputNumberModule,SliderModule, ButtonModule, InputTextModule]
})
export class ValuationComponent implements OnInit {
  //services
  private _valuticoService = inject(ValuationHttpService)
  private _router = inject(Router)
  //vars
  valuationForm: FormGroup;
  questions: ValuationQuestion[] = [];
  current_step = 1;
  totalSteps = 0;
  steps: string[] = [];

  //booleans
  isLoading = true;

  //streams
  valuticoQuestions$ = new Observable<ValuationResponse>()
  submit$ = new Observable<any>()

  constructor(private http: HttpClient,private fb: FormBuilder) {
    this.valuationForm = this.fb.group({
      client_email: [null, Validators.required],
      client_phone: [null, Validators.required], // Initialize here
    });
    
    // this.valuationForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.valuticoQuestions$ = this._valuticoService.getValuticoQuestions().pipe(tap(res=>{
      this.questions = res.questions;
      this.initializeForm();
      this.totalSteps = this.calculateTotalSteps(); // Updated calculation

      this.steps = Array(this.totalSteps).fill('').map((_, i) => `${i + 1}`);
      this.isLoading = false;
    }))
  }



  private initializeForm() {
    this.valuationForm.addControl("client_email", this.fb.control(null, Validators.required));
    this.valuationForm.addControl("client_phone", this.fb.control(null, Validators.required));
    this.questions.forEach(question => {
      if (question.type === 'input_with_select') {
        this.valuationForm.addControl(`${question.id}_value`, this.fb.control(null, this.getValidators(question)));
        // this.valuationForm.addControl(`${question.id}_currency`, this.fb.control(null, Validators.required));
      } else if (question.type === 'free_form_question') {
        this.valuationForm.addControl(question.id, this.fb.control(null, this.getValidators(question)));
        if (this.hasEditableOption(question)) {
          this.valuationForm.addControl(`${question.id}_other`, this.fb.control(''));
        }
      } else {
        this.valuationForm.addControl(question.id, this.fb.control(question.value ?? null, this.getValidators(question)));
      }

      if (question.id === '25642a58-77e9-4794-9203-18a9aaf2d438' || 
        question.id === 'e5b9a792-8e08-4d29-9083-54e5f563f629') {
        this.valuationForm.addControl(question.id, this.fb.control(null, Validators.required));
      }

      // Update the form initialization for sliders
      if (question.type === 'group_slider' && question.questions) {
        question.questions.forEach(subQuestion => {
          this.valuationForm.addControl(subQuestion.id, this.fb.control(subQuestion.value ?? 3));
        });
      }
    });
  }


  private getValidators(question: ValuationQuestion) {
    const validators = [];
    if (question.required) validators.push(Validators.required);
    if (question.validationRule) validators.push(Validators.pattern(question.validationRule));
    return validators;
  }


  getCurrentStepQuestions(): ValuationQuestion[] {
    let start = 0;
    
    // Calculate start based on previous steps
    for(let i = 1; i < this.current_step; i++) {
      if(i === 1) {
        start += 7; // First step has 7 questions
      } else if(i === 2 || i === 3) {
        start += 5; // Second and third steps have 4 questions each
      } else {
        start += 6; // Subsequent steps have 6 questions
      }
    }
  
    // Calculate end based on current step
    let end = start;
    if(this.current_step === 1) {
      end += 7;
    } else if(this.current_step === 2 || this.current_step === 3) {
      end += 4;
    } else {
      end += 6;
    }
  
    return this.questions.slice(start, end);
  }
  
  // Add this method to calculate total steps
  private calculateTotalSteps(): number {
    let totalSteps = 0;
    let count = 0;
    
    while(count < this.questions.length) {
      totalSteps++;
      
      if(totalSteps === 1) {
        count += 7;
      } else if(totalSteps === 2 || totalSteps === 3) {
        count += 4;
      } else {
        count += 6;
      }
    }
    
    return totalSteps-1;
  }
  










  isCurrentStepValid(): boolean {
    return this.getCurrentStepQuestions().every(question => {
      if (!question.required) return true;
      if (question.type === 'input_with_select') {
        return this.valuationForm.get(`${question.id}_value`)?.valid
        //  &&   this.valuationForm.get(`${question.id}_currency`)?.valid;
      }
      return this.valuationForm.get(question.id)?.valid;
    });
  }

  setStep(stepChange: number) {
    const newStep = this.current_step + stepChange;
    if (newStep > 0 && newStep <= this.totalSteps) {
      this.current_step = newStep;
    }
  }


  getCurrencyOptions(question: ValuationQuestion) {
    return question.options?.flatMap((group: any) => 
      group.options.map((opt: any) => ({
        label: opt.label,
        value: opt.value // Ensure this matches the API response structure
      }))
    ) || [];
  }



  getDropdownOptions(question: ValuationQuestion) {
    return question.options?.map(opt => ({
      ...opt,
      value: opt.id,
      label: opt.label || 'Other (specify)'
    })) || [];
  }


  // Add this method to your component
getSliderOptions(question: ValuationQuestion): any[] {
  const options = [];
  const min = question.min || 1;
  const max = question.max || 5;
  
  for (let i = min; i <= max; i++) {
    options.push({
      label: `${i} - ${i === min ? question.lowRiskName : i === max ? question.highRiskName : 'Medium Risk'}`,
      value: i
    });
  }
  return options;
}


  

  hasEditableOption(question: ValuationQuestion) {
    return question.options?.some(opt => opt.editable) || false;
  }

  submitValuation() {
    // const submissionData = this.prepareSubmissionData();
    // console.log("The submission data is", submissionData);
    if (this.valuationForm.valid) {
      const submissionData = this.prepareSubmissionData();
      this.submit$ = this._valuticoService.submitValuationData(submissionData).pipe(tap((res: any) => {
        console.log("The response from valutico is", res)
      }))
    }
  }

  private prepareSubmissionData() {
    const baseData = {
      client_email: this.valuationForm.get('client_email')?.value,
      client_phone: this.valuationForm.get('client_phone')?.value,
      locale: "en"
    };

    const questionnaire = this.questions.map(question => {
      const entry: any = { 
        id: question.id,
        type: question.type,
        question: question.question,
        required: question.required
      };

      switch(question.type) {
        case 'remote_autocomplete':
          entry.value = this.valuationForm.get(question.id)?.value?.value || null;
          break;
        case 'input_with_select':
          entry.value = this.valuationForm.get(`${question.id}_value`)?.value;
          entry.selectedValue = this.valuationForm.get(`${question.id}_currency`)?.value;
          break;
        case 'free_form_question':
          const selected = this.valuationForm.get(question.id)?.value;
          entry.value = selected?.editable 
            ? this.valuationForm.get(`${question.id}_other`)?.value 
            : selected;
          break;
        case 'input':
          entry.value = this.valuationForm.get(question.id)?.value;
          break;
        case 'group_slider':
          entry.questions = question.questions?.map(subQ => ({
            id: subQ.id,
            value: this.valuationForm.get(subQ.id)?.value
          }));
          break;
      }

      return entry;
    });

    return { ...baseData, questionnaire };
  }





  cancel() {
    console.log('Valuation cancelled');
    this._router.navigate(['/user-profile'])
    this.valuationForm.reset();
    this.current_step = 1;
  }

  getValuticoCountries$ = this._valuticoService.getValuticoCountries().pipe(tap(res=>{
    console.log("The valutico countries are ", res)
  }))

  getValuticoIndustries$ = this._valuticoService.getValuticoIndustries().pipe(tap(res=>{
    console.log("The valutico Industries are ", res)
  }))

  getValuticoPeers$ = this._valuticoService.getValuticoPeers().pipe(tap(res=>{
    console.log("The valutico Peers are ", res)
  }))

  getDummyCountries() {
    return [
      { value: 'US', label: 'United States' },
      { value: 'DE', label: 'Germany' },
      { value: 'FR', label: 'France' },
      { value: 'CN', label: 'China' },
      { value: 'JP', label: 'Japan' },
      { value: 'GB', label: 'United Kingdom' },
      { value: 'IN', label: 'India' }
    ];
  }
  
  getDummyIndustries() {
    return [
      { value: 'tech', label: 'Technology' },
      { value: 'finance', label: 'Financial Services' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'retail', label: 'Retail' },
      { value: 'energy', label: 'Energy' },
      { value: 'construction', label: 'Construction' }
    ];
  }

  getDummyPeers() {
    return [
      { value: 'tech', label: 'Technology' },
      { value: 'finance', label: 'Financial Services' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'retail', label: 'Retail' },
      { value: 'energy', label: 'Energy' },
      { value: 'construction', label: 'Construction' }
    ];
  }




}