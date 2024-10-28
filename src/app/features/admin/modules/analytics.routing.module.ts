import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/analytics/business/business.component').then(c => c.BusinessComponent)},
  { path: 'investors', loadComponent: () => import('../pages/analytics/investors/investors.component').then(c => c.InvestorsComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }