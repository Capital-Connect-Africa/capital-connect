import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthModule } from '../../modules/auth.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { USER_ROLES } from "../../../../shared";
import { DynamicRoutingService } from "../../../../shared/services/dynamic.routing.service";
import { OrganizationOnboardService } from "../../../organization/services/organization-onboard.service";
import { LoadingService } from '../../../../core';

@Component({
  selector: 'app-log-in-form',
  standalone: true,
  imports: [CommonModule, AuthModule, FormsModule, ReactiveFormsModule],
  templateUrl: './log-in-form.component.html',
  styleUrl: './log-in-form.component.scss'
})
export class LogInFormComponent {

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _dynamicRoutingService = inject(DynamicRoutingService);
  private _organizationService = inject(OrganizationOnboardService);
  private _loadingService = inject(LoadingService)

  @Output() goToForgetPasswordScreenEvent = new EventEmitter();
  logIn$ = new Observable<unknown>();
  routing$ = new Observable<unknown>();

  signInForm = this._formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  isTouchedOrDirty(formControlName: string) {

    const fieldIsTouched = this.signInForm.get(formControlName)?.touched;
    const fieldIsDirty = this.signInForm.get(formControlName)?.dirty;
    return fieldIsTouched || fieldIsDirty;
  }

  isValid(formControlName: string) {
    return this.signInForm.get(formControlName)?.valid;
  }

  submitCredentials() {
    this._loadingService.setLoading(true);

    const credentials = { username: this.signInForm.value.email as string, password: this.signInForm.value.password as string };

    this.logIn$ = this._authService.login(credentials).pipe(switchMap((profile) => {

      switch (profile.roles as USER_ROLES) {
        case USER_ROLES.USER:
          return this._organizationService.getCompanyOfUser().pipe(
            switchMap(company => {
              this._loadingService.setLoading(true);
              if (company) {
                this._loadingService.setLoading(false);
                return this._dynamicRoutingService.getNextRoute();
              } else {
                this._router.navigateByUrl('/organization/setup')
                this._loadingService.setLoading(false)
                return EMPTY
              }
            })
          )

        case USER_ROLES.INVESTOR:
          return this._dynamicRoutingService.getInvestorProfile()

        case USER_ROLES.ADMIN:
          this._router.navigateByUrl('/dashboard');
      }
      this._loadingService.setLoading(false)
      return EMPTY;
    }),
      catchError(error => {
        console.error(error)
        this._loadingService.setLoading(false)
        return EMPTY
      }))

  }

  goToForgetPassword() {
    this.goToForgetPasswordScreenEvent.emit()
  }

}
