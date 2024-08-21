import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { BusinessOnboardingService } from '../../services/business-profile/business.onboarding.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding-form',
  standalone: true,
  imports: [CommonModule, MultiSelectModule],
  templateUrl: './onboarding-form.component.html',
  styleUrl: './onboarding-form.component.scss'
})
export class OnboardingFormComponent {
  private _router =inject(Router);
  private _businessOnboardingService =inject(BusinessOnboardingService);

  choices$ =this._businessOnboardingService.getQuestionAnswers().pipe(tap(res =>{
    debugger
    return res
  }))

  goToDashboard(){
    this._router.navigateByUrl('/business')
  }
}
