import {booleanAttribute, Component, EventEmitter, inject, Output} from '@angular/core';
import { AuthModule } from '../../modules/auth.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, Observable, tap } from 'rxjs'
import { AuthService } from '../../services/auth.service';
import { CreateUserInput, FORM_TYPE, PASSWORD_STRENGTH } from '../../interfaces/auth.interface';
import { USER_ROLES } from '../../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, AuthModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  @Output() changeFormTypeEvent = new EventEmitter<FORM_TYPE>();

  signUpForm = this._formBuilder.group({
    accountType: ['', Validators.required],
    hasAcceptedTerms: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['']
  })

  listenToFormChanges$ = this.signUpForm.valueChanges.pipe(
    tap(formVals => {
      !!formVals.password?.length && !!formVals.confirmPassword?.length ? this._updatePasswordValidationChecks(formVals.password as string, formVals.email as string, formVals.confirmPassword as string)
        : this.passwordIsValid = false;
    })
  );
  signUp$!:Observable<unknown>;

  passwordIsValid = false;
  password_validation_checks: { check: string; isValid?: boolean; }[] = [];

  accountTypes: USER_ROLES[] = [USER_ROLES.ADVISOR, USER_ROLES.USER, USER_ROLES.INVESTOR, USER_ROLES.ADMIN]

  private _updatePasswordValidationChecks(password: string, email: string, confirmPassword: string) {

    this.password_validation_checks = [
      {
        check: 'Password Strength',
        isValid: this._getPasswordStrength(password) === PASSWORD_STRENGTH.STRONG ||
          this._getPasswordStrength(password) === PASSWORD_STRENGTH.MEDIUM
      },
      {
        check: 'Cannot contain your name or email address',
        isValid: !password.includes(email)
      },
      {
        check: 'At least 8 characters',
        isValid: password.length >= 8
      },
      {
        check: 'Contains a number or a symbol',
        isValid: /[0-9!@#$%^&*]/.test(password)
      },
      {
        check: 'Passwords dont match',
        isValid: password === confirmPassword
      }
    ];

    //TODO: @j-netcom-dev Check for  passwords will change here
    this.passwordIsValid = password === confirmPassword
    // this.passwordIsValid = this.password_validation_checks.map(check => check.isValid).every(check => !!check)

  }
  private _getPasswordStrength(password: string): PASSWORD_STRENGTH {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return PASSWORD_STRENGTH.STRONG;
    } else if (password.length >= 8) {
      return PASSWORD_STRENGTH.MEDIUM;
    } else {
      return PASSWORD_STRENGTH.WEAK
    }
  }

  isTouched(formControlName: string) {
    return this.signUpForm.get(formControlName)?.touched
  }

  isDirty(formControlName: string) {
    return this.signUpForm.get(formControlName)?.dirty
  }

  isTouchedOrDirty(formControlName: string) {
    return (this.isDirty(formControlName) || this.isTouched(formControlName))
  }

  isValid(formControlName: string) {
    return this.signUpForm.get(formControlName)?.valid
  }

  get getEmailFieldError() {
    return this.signUpForm.get('email')?.errors?.['required']
  }

  get passwordsAreSame() {
    return this.signUpForm.get('password')?.value === this.signUpForm.get('confirmPassword')?.value
  }

  submitForm() {
    const formValue = this.signUpForm.value;
    const input: CreateUserInput = {
      username: formValue.email as string,
      hasAcceptedTerms: formValue.hasAcceptedTerms as string,
      password: formValue.password as string,
      roles: formValue.accountType as USER_ROLES,
      firstName: formValue.firstName as string,
      lastName: formValue.lastName as string,
    }

    this.signUp$ = this._authService.signUpUser(input).pipe(tap((res) => {
      this._router.navigateByUrl('/verify-email', { state: { mode: 'unverified' } });
    }), catchError(err => {
      console.error(err);
      return EMPTY
    }))

  }
}
