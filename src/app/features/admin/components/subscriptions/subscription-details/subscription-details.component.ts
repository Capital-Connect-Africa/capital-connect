import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '../../../../../shared/interfaces/Billing';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from '../../../../../core/pipes/number-abbreviation.pipe';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';
import { SubscriptionsService } from '../../../services/subscriptions.service';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, TimeAgoPipe],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.scss'
})
export class SubscriptionDetailsComponent {
  plan: Plan | null =null;
  private _activatedRoute =inject(ActivatedRoute);
  private _subscriptionService =inject(SubscriptionsService);

  planId =Number(this._activatedRoute.snapshot.params['id']);
  plan$ =this._subscriptionService.getSubscription(this.planId).pipe(tap(plan =>{
    this.plan =plan
  }))
}
