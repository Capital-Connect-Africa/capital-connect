import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'my-business', loadChildren: () => import('./my.business.routing').then(m => m.MyBusinessRoutingModule) },
  { path: 'my-bookings', loadComponent: () => import('../pages/my-bookings/my-bookings.component').then(c => c.MyBookingsComponent) },
  { path: 'my-booking/:id/:bookingId', loadComponent: () => import('../pages/my-bookings/my-booking/my-booking.component').then(c => c.BookingComponent) },
  { path: 'financials', loadComponent: () => import('../pages/financials/financials.component').then(c => c.FinancialsComponent) },
  { path: 'plans', loadComponent: () => import('../../billing/pages/subscription/subscription.component').then(c => c.SubscriptionComponent) },
  { path: 'investor-eligibility', loadComponent: () => import('../pages/investor-eligibility/investor-eligibility.component').then(c => c.InvestorEligibilityComponent) },
  { path: 'investor-preparedness', loadComponent: () => import('../pages/investor-preparedness/investor-preparedness.component').then(c => c.InvestorPreparednessComponent) },
  { path: 'investors-db', loadComponent: () => import('../pages/investors-db/investors-db.component').then(c => c.InvestorsDbComponent) },
  { path: 'impact-assessment', loadComponent: () => import('../pages/impact-assessment/impact-assessment.component').then(c => c.ImpactAssessmentComponent) },
  { path: 'special-criteria', loadComponent: () => import('../pages/special-criteria/special-criteria.component').then(c => c.SpecialCriteriaComponent) },
  { path: 'special-criteria/:id', loadComponent: () => import('../pages/special-criteria-questions/special-criteria-questions.component').then(c => c.SpecialCriteriaQuestionsComponent) },
  { path: 'financial-reporting', loadComponent: () => import('../pages/FinancialReporting/financials.component').then(c => c.FinancialReportingPage) },
  { path: 'balance-sheets', loadComponent: () => import('../pages/BalanceSheets/BalanceSheets.component').then(c => c.BalanceSheetsPage) },
  {path: 'cash-flow', loadComponent: () => import('../pages/CashFlow/cashFlow.component').then(c => c.CashFlowPage) },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
