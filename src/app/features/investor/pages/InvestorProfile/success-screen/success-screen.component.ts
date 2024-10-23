import { Component, inject, OnInit } from '@angular/core';
import { AuthStateService } from '../../../../auth/services/auth-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../../../../shared/business/layout/layout.component';
import { FormsLayoutComponent } from '../../../../../shared/business/components/forms-layout/forms-layout.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, Observable, tap } from 'rxjs';
import { InvestorScreensService } from '../../../services/investor.screens.service';
import { FeedbackService } from '../../../../../core';
import { of } from 'rxjs';
import { InvestorProfile } from '../../../../../shared/interfaces/Investor';
import { Country } from '../../../../../shared/interfaces/countries';
import { CountriesService } from '../../../../../shared/services/countries.service';


@Component({
  selector: 'app-success-screen',
  standalone: true,
  imports: [CommonModule, LayoutComponent, FormsLayoutComponent,
    ReactiveFormsModule
  ],
  templateUrl: './success-screen.component.html',
  styleUrls: ['./success-screen.component.scss']
})
export class SuccessScreenComponent implements OnInit {

  private _router = inject(Router);
  private _authStateService = inject(AuthStateService);
  private _formBuilder = inject(FormBuilder);
  private _screenService = inject(InvestorScreensService)
  private _feedbackService = inject(FeedbackService)
  investorProfile: InvestorProfile = {} as InvestorProfile;
  countryOptions: Country[] = []
  private _countries = inject(CountriesService)



  userId: number = 0
  submit$ = new Observable<unknown>()
  message$ = new Observable<{ title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>;

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.message$ = this._feedbackService.message$;

    this.formGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      primaryContact: [false],
      countryCode: '',
      investorProfileId:this.investorProfile.id
    });
  }

  investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile =>{
    this.investorProfile = investorProfile

  }))


  // Submit the form
  onSubmit(): void {
    this.formGroup.value.investorProfileId = this.investorProfile.id
    
    const countryCode = this.formGroup.value.countryCode;
    const phoneNumber = this.formGroup.value.phoneNumber;

    this.formGroup.patchValue({
      phoneNumber: `${countryCode}${phoneNumber}`,
      investorProfileId:  this.investorProfile.id   

    });

    if (this.formGroup.valid) {
      const formData = this.formGroup.value;

      this.submit$ = this._screenService.createContactPerson(formData).pipe(
        tap(res => {
          this.formGroup.reset();
        }),
        catchError((error: any) => {
          this._feedbackService.error('Error Creating A Contact Person.', error);
          return of(null);
        }),
      )
    }
  }

  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countryOptions = countries
  }))


  // Navigate to the dashboard
  goDashboard(): void {
    this._router.navigateByUrl('/investor');
  }
}
