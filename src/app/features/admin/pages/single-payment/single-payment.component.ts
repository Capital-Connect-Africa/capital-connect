import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PaymentTabs } from '../../interfaces/payment.tabs.enum';
import { PaymentDetailsComponent } from "../../components/payments/payment-details/payment-details.component";

@Component({
  selector: 'app-single-payment',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, PaymentDetailsComponent],
  templateUrl: './single-payment.component.html',
  styleUrl: './single-payment.component.scss',
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
