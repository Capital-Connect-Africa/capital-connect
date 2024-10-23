import { Component, inject } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, Observable, Subscription, switchMap, tap } from 'rxjs';
import { SubscriptionResponse, SubscriptionTier } from '../../../../shared/interfaces/Billing';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { DialogModule } from 'primeng/dialog';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../../core/pipes/same-html.pipe';
import { FeatureFlagsService } from '../../../../core/services/FeatureFlags/feature-flags.service';

@Component({
  selector: 'billing-subscription',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, DialogModule, SafeHtmlPipe],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})

export class SubscriptionComponent {
  //Services
  private _ff = inject(FeatureFlagsService)

  //booleans
  billing_enabled: boolean = false

  //vars
  private flagSubscription: Subscription | undefined;


  tiers:SubscriptionTier[] =[];
  activePlan!:SubscriptionTier;
  redirectURL!: SafeResourceUrl;
  subscription!:SubscriptionResponse;
  signalService =inject(SignalsService);
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
    this.recentPayment$ =this._billingService.getRecentPayments();
  }

  subscribe(tierId: number){
    const selectedTier =this.tiers.find((tier: SubscriptionTier) =>tier.id ===tierId);
    if(selectedTier?.price ==0) return;
    this.plan =selectedTier?.name as string;
    // const activePlan =
    this.subscribe$ =this._billingService.subscribe(tierId, this.plan.toLowerCase() !=this.signalService.activePlan().toLowerCase()).pipe(tap(res =>{
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
}
