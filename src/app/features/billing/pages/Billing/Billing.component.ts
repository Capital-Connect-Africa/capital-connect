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
import { ConfirmationService } from '../../../../core';
import { Pipe } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-subscription-tiers',
  templateUrl: './Billing.component.html',
  styleUrls: ['./Billing.component.scss'],
  imports: [AngularMaterialModule, AdminUiContainerComponent, CommonModule, ReactiveFormsModule, FormsModule,DropdownModule],
  providers: [ConfirmationService],
})
export class BillingComponent {
  //vars
  subscriptionTiers: SubscriptionTier[] = [];
  subscription_names = ['basic','plus', 'pro', 'elite']
  create:boolean = false

  //Forms
  newTierForm!: FormGroup;


  //services
  private _bs = inject(BillingService)
  private _fs = inject(FeedbackService)
  private _cs = inject(ConfirmationService);

  //streams
  createTier$ = new Observable<unknown>()
  deleteTier$ = new Observable<unknown>()
  confirmation$ =new Observable<any>();
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


  createShow(){
    this.create = true
  }



  createTier() {
    if (this.newTierForm.valid) {
      this.createTier$ = this._bs.createSubscriptionTier(this.newTierForm.value).pipe(tap(
        res => {
          this.subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(res => {this.subscriptionTiers = res } ))          
          this._fs.success("Subscription Tier Created Successfully", 'Success')
          this.newTierForm.reset()
          this.create = false
        }
      ))
    }
  }

  deleteTier(id: number) {
    
    return this.confirmation$ =this._cs.confirm("Do you want to delete this subscription tier ...").pipe(tap(confirmation =>{

      this.deleteTier$ = this._bs.deleteTier(id).pipe(tap(res=>{
        this.subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(res => {this.subscriptionTiers = res } ))          
        this._fs.success("Subscription Deleted Successfully")
      }))  
      
    }))
   
  }


  cancel(){
    this.create = false
  }
   
  

  editTier(tier: SubscriptionTier) {
    this.create = true
    this.newTierForm.patchValue({
      name: tier.name,
      description: tier.description,
      price: tier.price
    });

    this._bs.updateSubscriptionTier(this.newTierForm.value, tier.id).pipe(tap(res=>{
      this._fs.success("Subscription Tier Updated Successfully")
      this.create = false
    }))
  }
  
}
