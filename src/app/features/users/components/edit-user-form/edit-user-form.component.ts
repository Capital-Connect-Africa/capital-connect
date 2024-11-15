import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { Role, User } from '../../models';
import { UsersHttpService } from '../../services/users-http.service';
import { Observable, tap } from 'rxjs';
import { BillingService } from '../../../billing/services/billing.service';
import { SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { FeedbackService } from '../../../../core';

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.scss']
})
export class EditUserFormComponent {

  private _fb = inject(FormBuilder);
  private _userService = inject(UsersHttpService);
  private _router = inject(Router);
  private readonly _bs = inject(BillingService)
  private _fs = inject(FeedbackService)



  updateUser$ = new Observable();
  assignsub$ = new Observable()
  assignSubscription$ = new Observable()

  editUserForm!: FormGroup;
  roles = Object.values(Role);

  @Input({ required: true }) user!: User;

  // active_subscription = this.user.activeSubscription.subscriptionTier.name ? this.user.activeSubscription.subscriptionTier.name : "basic"

  active_subscription = this.user?.activeSubscription?.subscriptionTier?.name || "basic";

  ngOnInit() {
    this.active_subscription = this.getActiveSubscription(this.user)
  }


  subscription_names = ['basic', 'plus', 'pro', 'elite']

  subscriptionTiers: SubscriptionTier[] = [];


  subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(
    res => {
      this.subscriptionTiers = res
    }
  ))

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      const user = changes['user'].currentValue;
      this.user = user;
      const activeSubscription = user.subscriptions.filter((subscription: { isActive: any; }) => subscription.isActive);

      this.editUserForm = this._fb.group({
        firstName: [user.firstName, Validators.required],
        lastName: [user.lastName, Validators.required],
        roles: [user.roles, Validators.required],
        active_subscription: [this.active_subscription, Validators.required],
      });
    }
  }

  getActiveSubscription(user: User): string {
    const activeSubscription = user.subscriptions.find((subscription: { isActive: boolean }) => subscription.isActive);
    return activeSubscription?.subscriptionTier?.name || 'basic';
  }

  isTouched(formControlName: string) {
    return this.editUserForm.get(formControlName)?.touched;
  }

  isDirty(formControlName: string) {
    return this.editUserForm.get(formControlName)?.dirty;
  }

  isValid(formControlName: string) {
    return this.editUserForm.get(formControlName)?.valid;
  }

  isTouchedOrDirty(formControlName: string) {
    return this.isDirty(formControlName) || this.isTouched(formControlName);
  }

  submitForm() {



    if (this.editUserForm.valid) {
      const updatedUser = {
        firstName: this.editUserForm.value.firstName,
        lastName: this.editUserForm.value.lastName,
        roles: this.editUserForm.value.roles
      };

      this.assignsub$ = this._bs.assignSubscriptionToUser(this.user.id, this.editUserForm.value.active_subscription.toString()).pipe(tap(res => {
        this._fs.success("Subscription Assigned to User Successfully")

      }))



      this.updateUser$ =
        this._userService.updateUserByAdmin(updatedUser, this.user.id).pipe(tap(() => {
          this._router.navigateByUrl('/users');
        }))
    } else {
      this.assignSubscription$ = this._userService.assignSubscriptionToUser(this.user.id, this.editUserForm.value.active_subscription.toString()).pipe(tap(res => {
        this._fs.success("Subscription Assigned to User Successfully")
        this._router.navigateByUrl('/users');

      }))
    }
  }

  cancelEdit() {
    this._router.navigateByUrl('/users');
  }
}
