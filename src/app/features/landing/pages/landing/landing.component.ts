import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogInFormComponent } from '../../../auth/components/log-in-form/log-in-form.component';
import { SignUpFormComponent } from '../../../auth/components/sign-up-form/sign-up-form.component';
import { FORM_TYPE } from '../../../auth/interfaces/auth.interface';
import { ForgotPasswordFormComponent } from '../../../auth/components/forgot-password-form/forgot-password-form.component';
import { WelcomeTemplateComponent } from '../../../../shared/components/welcome-template/welcome-template.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    SignUpFormComponent,
    LogInFormComponent,
    ForgotPasswordFormComponent,
    WelcomeTemplateComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private _router = inject(Router);
  activeRouteData: { mode: FORM_TYPE } = this._router.getCurrentNavigation()
    ?.extras.state as any;
  forms = FORM_TYPE;
  activeForm = FORM_TYPE.SIGNIN;
  ngOnInit() {
    if(this.activeRouteData)
      this.setActiveForm(this.activeRouteData.mode);
  }

  setActiveForm(formType: FORM_TYPE) {
    this.activeForm = formType;
  }
}
