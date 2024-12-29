import { Component, inject } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { BillingVoucherService } from '../../services/billing-voucher.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Voucher } from '../../../../shared/interfaces/voucher.interface';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { VoucherTabs } from '../../../organization/interfaces';
import { VoucherDetailsComponent } from "../../components/billing-vouchers/voucher-details/voucher-details.component";
import { VoucherUserComponent } from "../../components/billing-vouchers/voucher-user/voucher-user.component";
import { VoucherRulesComponent } from "../../components/billing-vouchers/voucher-rules/voucher-rules.component";

@Component({
  selector: 'app-single-billing-voucher',
  standalone: true,
  imports: [AdminUiContainerComponent, CommonModule, VoucherDetailsComponent, VoucherUserComponent, VoucherRulesComponent],
  templateUrl: './single-billing-voucher.component.html',
  styleUrl: './single-billing-voucher.component.scss',
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

export class SingleBillingVoucherComponent {
  voucher!:Voucher;
  private _activatedRoute =inject(ActivatedRoute);
  private _voucherService =inject(BillingVoucherService);

  private _voucherId =Number(this._activatedRoute.snapshot.params['id'])

  voucher$ =this._voucherService.getBillingVoucherById(this._voucherId).pipe(tap(res =>{
    this.voucher =res
  }))
  
  activeTab: VoucherTabs = 'voucherInfo';

  setActiveTab(tab: VoucherTabs) {
    this.activeTab = tab;
  }
}
