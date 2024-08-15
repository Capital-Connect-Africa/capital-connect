import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharedModule } from "../../../shared";
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { SignalsService } from '../../services/signals/signals.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobileNumber, UserMobileNumbersIssues } from '../../../features/auth/interfaces/auth.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, AlertComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _fb =inject(FormBuilder);
  issue =UserMobileNumbersIssues;
  signalsService =inject(SignalsService);
  private _authStateService = inject(AuthStateService);
  private _companyStateService = inject(CompanyStateService);
  
  businessName = this._companyStateService.currentCompany?.name
  businessLogoUrl = this._companyStateService.currentCompany?.companyLogo?.path ?? 'assets/img/avatar.jpeg';


  logOut$ = new Observable<boolean>();
  savephoneNumber$ =new Observable<any>();
  phoneNumberPull$ =new Observable<any>();


  investorProfileExists: boolean = false;

  ngOnInit() {
    this.investorProfileExists = !!sessionStorage.getItem('profileId');
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

  logOut() {
    this.logOut$ = this._authStateService.logout()
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
