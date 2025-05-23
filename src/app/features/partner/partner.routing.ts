import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'businesses', loadComponent: () => import('./pages/businesses/businesses.component').then(c => c.BusinessesComponent)},
  // { path: 'businesses/:id', loadComponent: () => import('./pages/business-user/business-user.component').then(c => c.BusinessUserComponent)},
  { path: 'investors', loadComponent: () => import('./pages/investors/investors.component').then(c => c.InvestorsComponent)},
  { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics.component').then(c => c.AnalyticsComponent)},
  { path: 'special-criteria', loadComponent: () => import('./pages/special-criteria/special-criteria.component').then(c => c.SpecialCriteriaComponent)},
  { path: 'special-criteria/:id', loadComponent: () => import('./pages/single-special-criteria/single-special-criteria.component').then(c => c.SingleSpecialCriteriaComponent)},

  { path: 'create-profile', loadComponent: () => import('./components/createProfile/createProfile.component').then(c => c.createPartnerProfileComponent)},
  { path: 'profile', loadComponent: () => import('./pages/partnerProfilePage/partnerProfilePage.component').then(c => c.PartnerProfilePage)},
  { path: 'contact-persons', loadComponent: () => import('../investor/pages/InvestorProfile/success-screen/success-screen.component').then(c => c.SuccessScreenComponent)},



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRouting { }