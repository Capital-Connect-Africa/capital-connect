import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'my-business', loadChildren: () => import('./my.business.routing').then(m => m.MyBusinessRoutingModule) },
  { path: 'my-bookings', loadComponent: () => import('../pages/my-bookings/my-bookings.component').then(c => c.MyBookingsComponent) },
  { path: 'financials', loadComponent: () => import('../pages/financials/financials.component').then(c => c.FinancialsComponent) },
  { path: 'investor-eligibility', loadComponent: () => import('../pages/investor-eligibility/investor-eligibility.component').then(c => c.InvestorEligibilityComponent) },
  { path: 'investor-preparedness', loadComponent: () => import('../pages/investor-preparedness/investor-preparedness.component').then(c => c.InvestorPreparednessComponent) },
  { path: 'impact-assessment', loadComponent: () => import('../pages/impact-assessment/impact-assessment.component').then(c => c.ImpactAssessmentComponent) },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
