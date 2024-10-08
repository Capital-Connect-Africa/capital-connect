import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', loadComponent: () => import('../pages/payments/payments.component').then(c => c.PaymentsComponent)},
    { path: ':id', loadComponent: () => import('../pages/single-payment/single-payment.component').then(c => c.SinglePaymentComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }