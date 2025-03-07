import { Component, inject } from '@angular/core';
import { ReferralLinkComponent } from "../../../../shared/components/referral-link/referral-link.component";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { User } from '../../../users/models';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { FeedbackService } from '../../../../core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReferralLinkComponent, ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  visible =false;
  isUserUpdating:boolean =false;

  updateUserProfile$ =new Observable();
  requestPasswordReset$ =new Observable();

  private _formBuilder =inject(FormBuilder);
  private _signalService =inject(SignalsService);
  private _usersService =inject(UsersHttpService);
  private _feedbackService =inject(FeedbackService);
  private _authStateService =inject(AuthStateService);

  userProfile =this._authStateService.currentUserProfile();

  updateForm =this._formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.email]]
  })

  ngOnInit(): void {
    this._signalService.pageTitle.set('Profile');
  }
  
  showModal(){
    if(!this.isUserUpdating) this.initForm();
    this.visible =true;
  }

  changePassword(){
    this.visible =false
  }

  
  updateProfile(){
    this.isUserUpdating =true;
    const values =this.updateForm.value as Partial<User>;
    const user:Partial<User> ={
      id: this.userProfile.id,
      ...values
    }

    this.updateUserProfile$ =this._usersService.updateUser(user).pipe(tap(() =>{
      this._feedbackService.success('Details updated successfully', 'Profile')
      this.reset();
    }), catchError(() =>{
      this.visible =false;
      return EMPTY;
    }))
  }

  /** populate form values */
  initForm(){ 
    this.updateForm.patchValue({
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      username: this.userProfile.username
    })
  }

  reset(){
    this.visible =false;
    this.updateForm.reset();
    this.isUserUpdating =false;
  }
  
}
