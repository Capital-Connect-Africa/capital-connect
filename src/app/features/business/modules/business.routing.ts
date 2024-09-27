import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'my-business', loadChildren: () => import('./my.business.routing').then(m => m.MyBusinessRoutingModule) },
  { path: 'my-bookings', loadComponent: () => import('../pages/my-bookings/my-bookings.component').then(c => c.MyBookingsComponent) },
  { path: 'financials', loadComponent: () => import('../pages/financials/financials.component').then(c => c.FinancialsComponent) },
  { path: 'plans', loadComponent: () => import('../../billing/pages/subscription/subscription.component').then(c => c.SubscriptionComponent) },
  { path: 'investor-eligibility', loadComponent: () => import('../pages/investor-eligibility/investor-eligibility.component').then(c => c.InvestorEligibilityComponent) },
  { path: 'investor-preparedness', loadComponent: () => import('../pages/investor-preparedness/investor-preparedness.component').then(c => c.InvestorPreparednessComponent) },
  { path: 'impact-assessment', loadComponent: () => import('../pages/impact-assessment/impact-assessment.component').then(c => c.ImpactAssessmentComponent) },
  { path: 'special-criteria', loadComponent: () => import('../pages/special-criteria/special-criteria.component').then(c => c.SpecialCriteriaComponent) },
  { path: 'special-criteria/:id', loadComponent: () => import('../pages/special-criteria-questions/special-criteria-questions.component').then(c => c.SpecialCriteriaQuestionsComponent) },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
