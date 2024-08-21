import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-onboarding-form',
  standalone: true,
  imports: [MultiSelectModule],
  templateUrl: './onboarding-form.component.html',
  styleUrl: './onboarding-form.component.scss'
})
export class OnboardingFormComponent {
  private _router =inject(Router)

  goToDashboard(){
    this._router.navigateByUrl('/business')
  }
}
