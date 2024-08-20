import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { catchError, EMPTY, filter, Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StepOneComponent } from '../../components/step-one/step-one.component';
import { StepTwoComponent } from '../../components/step-two/step-two.component';
import { StepThreeComponent } from '../../components/step-three/step-three.component';
import { StepFourComponent } from '../../components/step-four/step-four.component';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { CompanyResponse } from '../../interfaces';
import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, StepOneComponent, StepTwoComponent, StepThreeComponent, StepFourComponent],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent implements OnInit {

  private _organizationOnboardService = inject(OrganizationOnboardService);
  private _router = inject(Router);
  private _location = inject(Location);
  private _cd = inject(ChangeDetectorRef);
  private _authState =inject(AuthStateService)
  private _activateRoute = inject(ActivatedRoute);

  submitCompanyInfo$ = new Observable();
  companyToBeEdited$ = new Observable();
  companyOfUser$ = new Observable();

  isEditMode = !!this._activateRoute.snapshot.paramMap.get('id')?.length;
  editId = this._activateRoute.snapshot.paramMap.get('id')
  current_step = 1;
  steps = [1, 2, 3, 4];
  companyToBeEdited!: CompanyResponse;

  ngOnInit(): void {
    this._init();
  }

  private _init() {
    if (this.editId) {
      this.companyToBeEdited$ = this._organizationOnboardService.getCompanyToBeEdited(Number(this.editId)).pipe(tap(company => {
        this._organizationOnboardService.resetCompanyInput()
        this.companyToBeEdited = company;
        this._cd.detectChanges()
      }))
    } else {
      this.companyOfUser$ = this._organizationOnboardService.getCompanyOfUser().pipe(filter(() => !this.isEditMode), tap(company => {
        if (company && company.id) {
          this._cd.detectChanges()
          this.goToInvestorEligibility();
        }
      }));
    }
  }

  setStep(direction: number) {
    if (direction > 0 && (this.current_step >= this.steps.length)) return;
    if (direction < 0 && (this.current_step <= 1)) return;

    if (this.current_step === 3 && direction !== -1) { //Only do this if we are going forward
      this.submitCompanyInfo$ = this._organizationOnboardService.submitCompanyInfo(this.isEditMode, Number(this.editId) ?? null).pipe(tap(res => {
        this.companyOfUser$ = this._organizationOnboardService.getCompanyOfUser()
        if (this.isEditMode) this._router.navigateByUrl('/organization/list')
        this.current_step += direction

      }), catchError(err => {
        console.error('There was an error:', err)
        return EMPTY
      }))
    } else {
      this.current_step += direction;
    }
  }

  get isDisabled() {
    if (this.current_step === 1) return !this._organizationOnboardService.step1isValid();
    if (this.current_step === 2) return !this._organizationOnboardService.step2isValid();
    if (this.current_step === 3) return false //TODO: @pchessah add condition to check if upload of logo is successful
    return true;
  }

  goToInvestorEligibility() {
    this._router.navigateByUrl('/business/investor-eligibility')
  }
  goToDashBoard() {
    this._router.navigateByUrl('/business')
  }

  cancel() {
    this._organizationOnboardService.resetCompanyInput()
    this.isEditMode ? this._location.back() : this._authState.logout()
  }

  ngOnDestroy(): void {
    this._organizationOnboardService.resetCompanyInput()
  }
}
