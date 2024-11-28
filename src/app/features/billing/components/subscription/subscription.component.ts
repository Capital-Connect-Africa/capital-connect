import { Component, inject } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { PAYMENT_STATUS, PaymentPlan, SubscriptionResponse, SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { DialogModule } from 'primeng/dialog';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FeatureFlagsService } from '../../../../core/services/FeatureFlags/feature-flags.service';

@Component({
  selector: 'billing-subscription',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, DialogModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})

export class SubscriptionComponent {
  //Services
  private _ff = inject(FeatureFlagsService)

  //booleans
  billing_enabled: boolean = true
  totalPayableAmount =0;
  discount =0

  //vars
  private flagSubscription: Subscription | undefined;

  showInstructions: boolean =false
  selectedTier!:SubscriptionTier|null;
  retry:boolean =false
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

  initiatePayment(tierId: number, retry:boolean){
    this.retry =retry;
    this.showInstructions =true;
    this.selectedTier =this.tiers.find((tier: SubscriptionTier) =>tier.id ===tierId) as SubscriptionTier;
    this.totalPayableAmount =this.selectedTier.price + this.discount;
  }

  backToPlans(){
    this.retry =false;
    this.selectedTier =null;
    this.showInstructions =false;
    this.totalPayableAmount =this.discount;
  }

  subscribe(){
    if(this.selectedTier?.price ==0) return;
    this.plan =this.selectedTier?.name as string;
    if(this.retry) return this.retryPayment();
    const currentPlan =this.signalService.activePlan().toLowerCase();
    const upgrade =(this.plan.toLowerCase() !==currentPlan) && this.activePlan?.price >0;
    this.subscribe$ =this._billingService.subscribe(this.selectedTier?.id as number, upgrade).pipe(tap(res =>{
      this.subscription =res;
      this.signalService.userHasInitiatedPayment.set(true);
      this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(res.redirectUrl);
    }))
  }


  
  ngOnInit(): void {
    this.getRecentPayments()
    this._ff.initializeClient('subscription-businesses')

    this.billing_enabled = this._ff.getFeatureFlag('subscription-businesses',false)
    this.flagSubscription = this._ff.getFeatureFlagObservable().subscribe((flagValue) => {
      this.billing_enabled = flagValue;

    });
  }

  get upgradablePlans(){
    return this.tiers.filter((tier: SubscriptionTier) =>tier.price >this.activePlan?.price).map(tier =>tier.name.toLowerCase())
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.flagSubscription) {
      this.flagSubscription.unsubscribe();
    }
  }
  retryPayment(){
    this.signalService.userHasInitiatedPayment.set(true);
    this.redirectURL =this._sanitizer.bypassSecurityTrustResourceUrl(`https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${this.paymentAttempt?.orderTrackingId}`);
  }
}
