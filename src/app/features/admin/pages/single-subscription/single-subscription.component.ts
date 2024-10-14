import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PaymentTabs } from '../../interfaces/payment.tabs.enum';
import { PaymentDetailsComponent } from "../../components/payments/payment-details/payment-details.component";
import { SubscriptionDetailsComponent } from "../../components/subscriptions/subscription-details/subscription-details.component";

@Component({
  selector: 'app-single-payment',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, PaymentDetailsComponent, SubscriptionDetailsComponent],
  templateUrl: './single-subscription.component.html',
  styleUrl: './single-subscription.component.scss',
  animations: [
    trigger('tabChange', [
      state('companyInfo', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('ownerInfo', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.6s ease-in-out')
      ])
    ])
  ]
})

export class SinglePaymentComponent {
  tabs =PaymentTabs;
  activeTab: PaymentTabs =PaymentTabs.DETAILS;
  setActiveTab(tab: PaymentTabs){
    this.activeTab =tab;
  }
}
