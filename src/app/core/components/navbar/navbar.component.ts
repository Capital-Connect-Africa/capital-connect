import { Observable, switchMap, tap } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from "../../../shared";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SignalsService } from '../../services/signals/signals.service';
import { booleanAttribute, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { BillingService } from '../../../features/billing/services/billing.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { MobileNumber, UserMobileNumbersIssues } from '../../../features/auth/interfaces/auth.interface';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, FormsModule, DropdownModule, CommonModule, RouterModule, AlertComponent, DialogModule, ReactiveFormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  savedPhoneNumbers: MobileNumber[] = [];
  selectedPhoneNumber!: string;
  showResendOptions: boolean = false;


  @Input() showBanner =true;
  issue =UserMobileNumbersIssues;
  private _router =inject(Router);
  private _fb =inject(FormBuilder);
  signalsService =inject(SignalsService);
  private _billingService =inject(BillingService);
  private _permissions =inject(PermissionsService);
  private _feedbackService =inject(FeedbackService);
  private _authStateService =inject(AuthStateService);
  private _companyStateService =inject(CompanyStateService);


  @Input() title =this._companyStateService.currentCompany?.name;
  businessLogoUrl = this._companyStateService.currentCompany?.companyLogo?.path ?? 'assets/img/avatar.jpeg';
  activePlan$ =new Observable();
  savephoneNumber$ =new Observable<any>();
  phoneNumberPull$ =new Observable<any>();
  resendVerification$ = new Observable<any>();
  userHasNotAcceptedTerms =!this._authStateService.currentUserProfile().hasAcceptedTerms && !this._authStateService.userIsAdmin;

  consent$ =new Observable();
  userConcentForm =this._fb.group({
    hasAcceptedTerms: ['', [Validators.required]],
    hasAcceptedPrivacyPolicy: ['', [Validators.required]],
  })


  investorProfileExists: boolean = false;

  ngOnInit() {
    this.loadSavedNumbers();
    this.investorProfileExists = !!sessionStorage.getItem('profileId');
    if(this._permissions.canFetchActiveSubscription()){
      if(!this.signalsService.activePlan()){
        this.activePlan$ =this._billingService.getActivePlan().pipe(tap(res =>{
          this.signalsService.activePlan.set(res.subscriptionTier.name || 'basic');
        }))
      }
    }
  }


  showResendOptionsfunc(){
    this.showResendOptions = true
  }

 
  loadSavedNumbers() {
    this.savedPhoneNumbers = JSON.parse(sessionStorage.getItem('mobile_numbers') ?? '[]');
  }

  @Input({ transform: booleanAttribute }) onDashboard: boolean = false;
  @Input() isAdmin = false;

  userFirstName =this._authStateService.currentUserProfile().firstName;
  phoneUpdateForm =this._fb.group({
    field: ['', [Validators.required,]],
    selectedPhoneNumber:['0',[Validators.required]]
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

  resendVerificationCode() {
    console.log("Resending the verication code", this.phoneUpdateForm.value.selectedPhoneNumber)
    const userId = this._authStateService.currentUserId();
    console.log("The current User id is", userId)
    if(this.phoneUpdateForm.value.selectedPhoneNumber){
     this.resendVerification$ =  this._authStateService.resendVerificationCode(this.phoneUpdateForm.value.selectedPhoneNumber).pipe(tap(res=>{

      }))
    }  

  }

  ngOnChanges(){
    this.phoneNumberPull$ =this._authStateService.checkPhoneNumberStatus().pipe(tap((res: UserMobileNumbersIssues) =>{
      this.signalsService.showInAppAlert.set(res !==UserMobileNumbersIssues.VERIFIED);
      if(res ===UserMobileNumbersIssues.UNVERIFIED)
        this.signalsService.actionBody.set({issue: UserMobileNumbersIssues.UNVERIFIED, command: 'Verify', message: 'Please Verify your phone number', title: 'Action Required'})
    }));
  }

  saveUserConsent(){
    const {hasAcceptedTerms, hasAcceptedPrivacyPolicy} =this.userConcentForm.value;
    this.consent$ =this._authStateService.updateUserConsent({hasAcceptedPrivacyPolicy:!!hasAcceptedPrivacyPolicy, hasAcceptedTerms: !!hasAcceptedTerms}).pipe(switchMap(_ =>{
      return this._authStateService.reload().pipe(tap((res:any) =>{
        this._feedbackService.success(res.message, 'Thank you')
        this.userHasNotAcceptedTerms =false;
      }))
    }));
  }
  
}
