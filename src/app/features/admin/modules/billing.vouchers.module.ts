import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { 
      path: '', 
      loadComponent: () => import('../pages/billing-vouchers/billing-vouchers.component')
      .then(c => c.BillingVouchersComponent),
      pathMatch: 'full',
    },
    {
      path: ':id',
      loadComponent: () =>import('../pages/single-billing-voucher/single-billing-voucher.component')
      .then(c =>c.SingleBillingVoucherComponent)
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingVouchersRoutingModule { }