import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharedModule, USER_ROLES } from "../../../shared";
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { SignalsService } from '../../services/signals/signals.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobileNumber, UserMobileNumbersIssues } from '../../../features/auth/interfaces/auth.interface';
import { BillingService } from '../../../features/billing/services/billing.service';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, AlertComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _fb =inject(FormBuilder);
  private _router =inject(Router)
  issue =UserMobileNumbersIssues;
  signalsService =inject(SignalsService);
  private _billingService =inject(BillingService);
  private _permissions =inject(PermissionsService);
  private _authStateService = inject(AuthStateService);
  private _companyStateService = inject(CompanyStateService);
  @Input() showBanner =true;
  @Input() title =this._companyStateService.currentCompany?.name;
  businessLogoUrl = this._companyStateService.currentCompany?.companyLogo?.path ?? 'assets/img/avatar.jpeg';
  activePlan$ =new Observable();

  savephoneNumber$ =new Observable<any>();
  phoneNumberPull$ =new Observable<any>();


  investorProfileExists: boolean = false;

  ngOnInit() {
    this.investorProfileExists = !!sessionStorage.getItem('profileId');
    if(this._permissions.canFetchActiveSubscription(this._authStateService.currentUserProfile().roles as USER_ROLES)){
      if(!this.signalsService.activePlan()){
        this.activePlan$ =this._billingService.getActivePlan().pipe(tap(res =>{
          this.signalsService.activePlan.set(res.name || 'basic');
        }))
      }
    }
  }

  @Input({ transform: booleanAttribute }) onDashboard: boolean = false;
  @Input() isAdmin = false;

  userFirstName =this._authStateService.currentUserProfile().firstName;
  phoneUpdateForm =this._fb.group({
    field: ['', [
      Validators.required,
    ]]
  })

  drawerShowing = false;
  toggleDrawer() {
    this.drawerShowing = !this.drawerShowing;
  }

  goToProfile(){
    this._router.navigateByUrl('/user-profile')
  }

  showDialog(){
    this.signalsService.showDialog.set(true)
  }

  savePhoneNumber(){
    const field =(this.phoneUpdateForm.value?.field)??'';
    if(this.signalsService.actionBody().issue ==this.issue.EMPTY){
      this.savephoneNumber$ =this._authStateService.saveUserPhoneNumberAddedStatus(field).pipe(tap(res =>{
        return res
      }))
      
    } else if(this.signalsService.actionBody().issue ==this.issue.UNVERIFIED){
      const mobileNumbers:MobileNumber[] =JSON.parse(sessionStorage.getItem('mobile_numbers')??JSON.stringify([]))
      if(mobileNumbers.length){
        this.savephoneNumber$ =this._authStateService.verifyPhoneNumber(field, mobileNumbers.at(0)?.phoneNo??'').pipe(tap(res =>{
          return res
        }))

      }
    }
  }

  ngOnChanges(): void {
    this.phoneNumberPull$ =this._authStateService.checkPhoneNumberStatus().pipe(tap((res: UserMobileNumbersIssues) =>{
      this.signalsService.showInAppAlert.set(res !==UserMobileNumbersIssues.VERIFIED);
      if(res ===UserMobileNumbersIssues.UNVERIFIED)
        this.signalsService.actionBody.set({issue: UserMobileNumbersIssues.UNVERIFIED, command: 'Verify', message: 'Please Verify your phone number', title: 'Action Required'})
    }));
  }
}
