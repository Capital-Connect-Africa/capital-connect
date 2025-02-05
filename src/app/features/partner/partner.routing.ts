import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'businesses', loadComponent: () => import('./pages/businesses/businesses.component').then(c => c.BusinessesComponent)},
  { path: 'businesses/:id', loadComponent: () => import('./pages/business-user/business-user.component').then(c => c.BusinessUserComponent)},
  { path: 'investors', loadComponent: () => import('./pages/investors/investors.component').then(c => c.InvestorsComponent)},
  { path: 'investors/:id', loadComponent: () => import('./pages/investor-user/investor-user.component').then(c => c.InvestorUserComponent)},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRouting { }