import { Component, inject } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { PAYMENT_STATUS, PaymentPlan, SubscriptionResponse, SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { DialogModule } from 'primeng/dialog';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../../core/pipes/same-html.pipe';

@Component({
  selector: 'billing-subscription',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, DialogModule, SafeHtmlPipe],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})

export class SubscriptionComponent {
  paymentStatus =PAYMENT_STATUS
  tiers:SubscriptionTier[] =[];
  activePlan!:SubscriptionTier;
  redirectURL!: SafeResourceUrl;
  subscription!:SubscriptionResponse;
  signalService =inject(SignalsService);
  paymentAttempt: PaymentPlan | undefined
  private _sanitizer =inject(DomSanitizer);
  private _billingService =inject(BillingService);
  recentPayment$ =new Observable();
  upgradablePlansList:string[] =[]
  subscribe$ =new Observable<SubscriptionResponse>();
  plan:string ='';
  subscriptionTiers$ =this._billingService.getSubscriptionTiers().pipe(switchMap(res =>{
    this.tiers =res;
    if(!this.signalService.activePlan()){
      return this._billingService.getActivePlan().pipe(tap(res =>{
        this.activePlan =res.subscriptionTier;
        this.upgradablePlansList =this.upgradablePlans;
        this.signalService.activePlan.set(res.subscriptionTier.name);
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
  
  getRecentPayments(){
    this.recentPayment$ =this._billingService.getRecentPayments().pipe(map(res =>{
      this.paymentAttempt =res.find((plan: PaymentPlan) =>(plan.status.toLowerCase()) !==PAYMENT_STATUS.COMPLETED);
    }))
  }

  subscribe(tierId: number, retry:boolean){
    const selectedTier =this.tiers.find((tier: SubscriptionTier) =>tier.id ===tierId);
    if(selectedTier?.price ==0) return;
    this.plan =selectedTier?.name as string;
    if(retry){
      this.retryPayment();
      return 
    }
    const currentPlan =this.signalService.activePlan().toLowerCase();
    const upgrade =(this.plan.toLowerCase() !==currentPlan) && this.activePlan?.price >0;
    this.subscribe$ =this._billingService.subscribe(tierId, upgrade).pipe(tap(res =>{
      this.subscription =res;
      this.signalService.userHasInitiatedPayment.set(true);
      this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(res.redirectUrl);
    }))
  }
  
  ngOnInit(): void {
    this.getRecentPayments()
  }

  get upgradablePlans(){
    return this.tiers.filter((tier: SubscriptionTier) =>tier.price >this.activePlan?.price).map(tier =>tier.name.toLowerCase())
  }

  retryPayment(){
    this.signalService.userHasInitiatedPayment.set(true);
    this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(`https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${this.paymentAttempt?.orderTrackingId}`);
  }
}
