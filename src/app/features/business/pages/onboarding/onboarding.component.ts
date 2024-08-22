import { Component } from '@angular/core';
import { LayoutComponent } from "../../../../shared/business/layout/layout.component";
import { OnboardingFormComponent } from "../../components/onboarding-form/onboarding-form.component";

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [LayoutComponent, OnboardingFormComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {

}
