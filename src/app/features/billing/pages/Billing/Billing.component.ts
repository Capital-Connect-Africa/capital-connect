import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { Editor, EditorModule } from 'primeng/editor';
import { AngularMaterialModule } from '../../../../shared';
import { AdminUiContainerComponent } from '../../../admin/components/admin-ui-container/admin-ui-container.component';
import { SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { BillingService } from '../../services/billing.service';
import { FeedbackService, ConfirmationService } from '../../../../core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-subscription-tiers',
  templateUrl: './Billing.component.html',
  styleUrls: ['./Billing.component.scss'],
  imports: [AngularMaterialModule, AdminUiContainerComponent, CommonModule, ReactiveFormsModule, FormsModule, DropdownModule, ModalComponent, EditorModule],
  providers: [ConfirmationService],
})
export class BillingComponent {
  //services
  private readonly _bs = inject(BillingService)
  private readonly _fs = inject(FeedbackService)
  private readonly _cs = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);


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


  @ViewChild('editor') editor!: Editor;

  //vars
  subscriptionTiers: SubscriptionTier[] = [];
  subscription_names = ['basic', 'plus', 'pro', 'elite']
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
  }

  createTier() {
    if (this.editMode) {
      this.newTierForm.value.price = parseInt(this.newTierForm.value.price);
      this.newTierForm.value.description = this.editor.getQuill().getText();

      this.updateTier$ = this._bs.updateSubscriptionTier(this.newTierForm.value, this.tier.id).pipe(
        switchMap(() => this._bs.getSubscriptionTiers()),
        tap(res => {
          this.subscriptionTiers = res;
          this._fs.success("Subscription Tier Updated Successfully");
          this.create = false;
          this.editMode = false;
          this.newTierForm.reset();
        })
      );
    } else if (!this.editMode) {
      if (this.newTierForm.valid) {
        this.createTier$ = this._bs.createSubscriptionTier(this.newTierForm.value).pipe(
          switchMap(() => this._bs.getSubscriptionTiers()),
          tap(res => {
            this.subscriptionTiers = res;
            this._fs.success("Subscription Tier Created Successfully", 'Success');
            this.newTierForm.reset();
            this.create = false;
            this.editMode = false;
          }));

  
      }
    }
  }

  deleteTier(id: number) {
    this.confirmation$ = this._cs.confirm("Do you want to delete this subscription tier ...").pipe(tap(() => {
      this.deleteTier$ = this._bs.deleteTier(id).pipe(tap(() => {
        this.subscriptionTiers$ = this._bs.getSubscriptionTiers().pipe(tap(res => { this.subscriptionTiers = res }))
        this._fs.success("Subscription Deleted Successfully")
      }))
    }))
  }

  cancel() {
    this.create = false
  }

  editTier(tier: SubscriptionTier) {
    this.tier = tier
    this.editMode = true
    this.create = true

    // this.editor?.editorService.setContent(existingDetails.description);
    // this.editor.setValue(existingDetails.description);
    // this.editor.value = "Halooo";

    this.text = this.tier.description

    this.newTierForm.patchValue({
      name: this.tier.name,
      description: this.tier.description,
      price: this.tier.price
    });

    if (this.editor?.getQuill()) {
      this.editor.getQuill().setText(this.tier.description || '');
    }

  }

}
