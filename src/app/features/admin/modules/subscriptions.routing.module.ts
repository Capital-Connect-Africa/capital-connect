import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', loadComponent: () => import('../pages/subscriptions/subscriptions.component').then(c => c.SubscriptionsComponent)},
    { path: ':id', loadComponent: () => import('../pages/single-subscription/single-subscription.component').then(c => c.SinglePaymentComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }