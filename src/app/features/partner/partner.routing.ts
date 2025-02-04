import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'businesses', loadComponent: () => import('./pages/businesses/businesses.component').then(c => c.BusinessesComponent)},
  { path: 'investors', loadComponent: () => import('./pages/investors/investors.component').then(c => c.InvestorsComponent)},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRouting { }