import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { Editor, EditorModule } from 'primeng/editor';
import { AngularMaterialModule } from '../../../../shared';
import { Component, inject, ViewChild } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { FeedbackService, ConfirmationService } from '../../../../core';
import { SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminUiContainerComponent } from '../../../admin/components/admin-ui-container/admin-ui-container.component';


@Component({
  standalone: true,
  selector: 'app-subscription-tiers',
  templateUrl: './Billing.component.html',
  styleUrls: ['./Billing.component.scss'],
  imports: [AngularMaterialModule, AdminUiContainerComponent, CommonModule, ReactiveFormsModule, FormsModule, DropdownModule, ModalComponent, EditorModule, MenuModule],
  providers: [ConfirmationService],
})
export class BillingComponent {
  //services
  private readonly _bs = inject(BillingService)
  private readonly _fs = inject(FeedbackService)
  private readonly _cs = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);

  features =['']
  //streams
  createTier$ = new Observable<unknown>()
  deleteTier$ = new Observable<unknown>()
  updateTier$ = new Observable<unknown>()
  confirmation$ = new Observable<any>();

  subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(
    res => {
      this.subscriptionTiers = res
    }
  ))

  featuresHasValues =false

  @ViewChild('editor') editor!: Editor;

  items: MenuItem[] | undefined;
  

  //vars
  subscriptionTiers: SubscriptionTier[] = [];
  subscription_names = [{label: 'Basic', value: 'basic'}, {label: 'Plus', value: 'plus'}, {label: 'Pro', value: 'pro'}, {label: 'Elite', value: 'elite'}]
  create = false
  editMode = false
  tier!: SubscriptionTier
  text!: string

  //Forms
  newTierForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required]],
  });

  createShow() {
    this.create = true
    this.editMode = false
    this.newTierForm.reset()
  }

  createTier() {
    this.features =this.features.filter(feature =>feature.length >0)
    if (this.editMode) {
      this.newTierForm.value.price = parseInt(this.newTierForm.value.price);

      this.updateTier$ = this._bs.updateSubscriptionTier({...this.newTierForm.value, features: this.features}, this.tier.id).pipe(
        switchMap(() => this._bs.getSubscriptionTiers()),
        tap(res => {
          this.subscriptionTiers = res;
          this._fs.success("Subscription Tier Updated Successfully");
          this.create = false;
          this.editMode = false;
          this.features =['']
          this.newTierForm.reset();
        })
      );
    } else if (!this.editMode) {
      if (this.newTierForm.valid) {
        this.createTier$ = this._bs.createSubscriptionTier({...this.newTierForm.value, features: this.features},).pipe(
          switchMap(() => this._bs.getSubscriptionTiers()),
          tap(res => {
            this.subscriptionTiers = res;
            this._fs.success("Subscription Tier Created Successfully", 'Success');
            this.newTierForm.reset();
            this.create = false;
            this.editMode = false;
            this.features =[''];
          }));

  
      }
    }
  }

  deleteTier(id: number) {
    this.confirmation$ = this._cs.confirm("Do you want to delete this subscription tier ...").pipe(tap(res => {
      if(res){
        this.deleteTier$ = this._bs.deleteTier(id).pipe(tap(() => {
          this.subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(res => { this.subscriptionTiers = res }))
          this._fs.success("Subscription Deleted Successfully")
        }))
      }
    }))
  }

  cancel() {
    this.create = false
    this.newTierForm.reset()
  }

  editTier(tier: SubscriptionTier) {
    this.tier = tier
    this.editMode = true
    this.create = true


    this.text = "This is an update test"

    this.newTierForm.patchValue({
      name: this.tier.name,
      description: this.tier.description,
      price: this.tier.price
    });

    this.features =tier.features;
    this.featuresNotEmpty();

  }
  addFeature(){
    this.features.push('')
    this.featuresNotEmpty();
  }

  removeFeature(index:number){
    if(this.features.length >1) this.features.splice(index, 1);
    this.featuresNotEmpty();
  }

  onValueChange(index:number, event:Event){
    const target =event.target as HTMLInputElement
    const {value} =target;
    this.features[index] =value;
    this.featuresNotEmpty();
  }

  featuresNotEmpty(){
    this.featuresHasValues =this.features.some(feature =>feature.length >0)
  }
}
