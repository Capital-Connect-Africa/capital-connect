import { Component, inject } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { SubscriptionResponse, SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { DialogModule } from 'primeng/dialog';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'billing-subscription',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, DialogModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})

export class SubscriptionComponent {
  tiers:SubscriptionTier[] =[];
  redirectURL!: SafeResourceUrl;
  subscription!:SubscriptionResponse;
  signalService =inject(SignalsService);
  private _sanitizer =inject(DomSanitizer);
  private _billingService =inject(BillingService);
  subscribe$ =new Observable<SubscriptionResponse>();
  plan:string ='';
  subscriptionTiers$ =this._billingService.getSubscriptionTiers().pipe(tap(res =>{
    this.tiers =res;
  }))

  subscribe(tierId: number){
    this.plan =this.tiers.find((tier: SubscriptionTier) =>tier.id ===tierId)?.name as string;
    this.subscribe$ =this._billingService.subscribe(tierId).pipe(tap(res =>{
      this.subscription =res;
      this.signalService.userHasInitiatedPayment.set(true);
      this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(res.redirectUrl);
    }))
  }
}
