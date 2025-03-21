import { Component, inject } from '@angular/core';
import { ReferralLinkComponent } from "../../../../shared/components/referral-link/referral-link.component";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { User } from '../../../users/models';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { ConfirmationService, FeedbackService } from '../../../../core';
import { AuthService } from '../../../auth/services/auth.service';
import { ProfileService } from '../../../profile/services/profile.service';
import { StaffService } from '../../staff.service';
import { Router } from '@angular/router';
import { StaffProfile } from '../../../../shared/interfaces/partner';
import { Profile } from '../../../../shared/interfaces/profile.interface';
import { MatIcon } from '@angular/material/icon';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
// import { Profile} from '../../../auth/interfaces/auth.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReferralLinkComponent, ModalComponent, MatIcon, CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  //services
  private _profileService = inject(ProfileService);
  private _staffService = inject(StaffService);
  private _router = inject(Router);
  

  //streams
  staffProfile$ = new Observable<StaffProfile>();

  //vars
  userId: number = 0;
  private userProfile!: Profile;

  visible =false;
  isUserUpdating:boolean =false;
  updateUserProfile$ =new Observable();
  requestPasswordReset$ =new Observable();

  private _formBuilder =inject(FormBuilder);
  private _authService =inject(AuthService);
  private _signalService =inject(SignalsService);
  private _usersService =inject(UsersHttpService);
  private _feedbackService =inject(FeedbackService);
  private _authStateService =inject(AuthStateService);
  private _confirmationService =inject(ConfirmationService);



  updateForm =this._formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    // username: ['', [Validators.required, Validators.email]]
  })


  userProfile$ = this._profileService.get().pipe(
    tap(res => {
      this.userProfile = res;
      return res;
    })
  );


  goToCreate(){
    this._router.navigate(['create-staff-profile']);
  }


  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    this._signalService.pageTitle.set('Profile');

    if (userId) {
      this.userId = parseInt(userId);

      this.staffProfile$ = this._staffService.getStaffProfileByUserId(this.userId).pipe(
        tap(res => {
          localStorage.setItem('staffProfileId',res.id.toString());
          if (!res.id) {
            this._router.navigate(['staff/create-profile']);
          }
        })
      );
    }
  }



  
  // showModal(){
  //   if(!this.isUserUpdating) this.initForm();
  //   this.visible =true;
  // }

  // changePassword(){
  //   this.visible =false;
  //   this.requestPasswordReset$ =this._confirmationService.confirm(`We will email instructions to change your password to: ${this.userProfile.username}`).pipe(switchMap(res =>{
  //     return res ? this._authService.forgotPassword(this.userProfile.username).pipe(tap(res =>{
  //       this._feedbackService.success('We emailed you with instructions on reseting your password');
  //       this.reset()
  //     })): EMPTY;
  //   }))
    
  // }

  
  // updateProfile(){
  //   this.isUserUpdating =true;
  //   const values =this.updateForm.value as Partial<User>;
  //   const user:Partial<User> ={
  //     id: this.userProfile.id,
  //     ...values
  //   }

  //   this.updateUserProfile$ =this._usersService.updateUser(user).pipe(tap(() =>{
  //     this._feedbackService.success('Details updated successfully', 'Profile')
  //     this.reset();
  //   }), catchError(() =>{
  //     this.visible =false;
  //     return EMPTY;
  //   }))
  // }

  /** populate form values */
  // initForm(){ 
  //   this.updateForm.patchValue({
  //     firstName: this.userProfile.firstName,
  //     lastName: this.userProfile.lastName,
  //     // username: this.userProfile.username
  //   })
  // }

  reset(){
    this.visible =false;
    this.updateForm.reset();
    this.isUserUpdating =false;
  }
  
}
