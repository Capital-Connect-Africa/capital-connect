import { Component, inject } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
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
  activePlan!:SubscriptionTier;
  redirectURL!: SafeResourceUrl;
  subscription!:SubscriptionResponse;
  signalService =inject(SignalsService);
  private _sanitizer =inject(DomSanitizer);
  private _billingService =inject(BillingService);
  subscribe$ =new Observable<SubscriptionResponse>();
  plan:string ='';
  subscriptionTiers$ =this._billingService.getSubscriptionTiers().pipe(switchMap(res =>{
    this.tiers =res;
    if(!this.signalService.activePlan()){
      return this._billingService.getActivePlan().pipe(tap(res =>{
        this.activePlan =res;
        this.signalService.activePlan.set(res.name);
      }),
      catchError(err =>{
        this.activePlan =this.tiers.find((tier:SubscriptionTier) =>tier.price ==0) as SubscriptionTier;
        this.signalService.activePlan.set(this.activePlan.name);
        return EMPTY;
      })
    )
  }
  return EMPTY;
  }))
  

  subscribe(tierId: number){
    const selectedTier =this.tiers.find((tier: SubscriptionTier) =>tier.id ===tierId);
    if(selectedTier?.price ==0) return;
    this.plan =selectedTier?.name as string;
    this.subscribe$ =this._billingService.subscribe(tierId).pipe(tap(res =>{
      this.subscription =res;
      this.signalService.userHasInitiatedPayment.set(true);
      this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(res.redirectUrl);
    }))
  }
}
