// subscription-tiers.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularMaterialModule } from '../../../../shared';
import { AdminUiContainerComponent } from '../../../admin/components/admin-ui-container/admin-ui-container.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { BillingService } from '../../services/billing.service';
import { Observable, tap } from 'rxjs';
import { FeedbackService } from '../../../../core';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  standalone: true,
  selector: 'app-subscription-tiers',
  templateUrl: './Billing.component.html',
  styleUrls: ['./Billing.component.scss'],
  imports: [AngularMaterialModule, AdminUiContainerComponent, CommonModule, ReactiveFormsModule, FormsModule,DropdownModule]
})
export class BillingComponent {
  //vars
  subscriptionTiers: SubscriptionTier[] = [];
  subscription_names = ['basic','plus', 'pro', 'elite']

  //Forms
  newTierForm!: FormGroup;


  //services
  _bs = inject(BillingService)
  _fs = inject(FeedbackService)

  //streams
  createTier$ = new Observable<unknown>()
  subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(
    res => {
      this.subscriptionTiers = res
    }
  ))

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.newTierForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }




  createTier() {
    if (this.newTierForm.valid) {
      this.createTier$ = this._bs.createSubscriptionTier(this.newTierForm.value).pipe(tap(
        res => {
          this.subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(res => {this.subscriptionTiers = res } ))          
          this._fs.success("Subscription Tier Created Successfully", 'Success')
          this.newTierForm.reset()
        }
      ))
    }
  }

  deleteTier(id: number) {
    // this.http.delete(`${this.apiUrl}/${id}`, {
    //   headers: { Authorization: this.token }
    // }).subscribe(() => this.getSubscriptionTiers());
  }

  editTier(tier: SubscriptionTier) {
    // this.newTier = { ...tier }; // Populate the form with the tier to edit
  }
}
