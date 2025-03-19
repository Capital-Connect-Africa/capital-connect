import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealsLayoutComponent } from '../components/deals/deals-layout/deals-layout.component';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'onboarding', loadComponent: () => import('../pages/InvestorProfile/landing/landing.component').then(c => c.LandingComponent) },
  { path: 'manage-access', loadComponent: () => import('../pages/manage-access/manage-access.component').then(c => c.ManageAccessComponent) },
  { path: 'investor-details', loadComponent: () => import('../pages/InvestorProfile/InvestorProfile/InvestorProfile.component').then(c => c.InvestorProfileComponent) },
  { path: 'contact-person', loadComponent: () => import('../pages/InvestorProfile/success-screen/success-screen.component').then(c => c.SuccessScreenComponent) },
  { path: 'matched-business', loadComponent: () => import('../pages/MatchedBusiness/matchedBusiness.component').then(c => c.MatchedBusinesComponent) },
  { path: 'interesting-businesess', loadComponent: () => import('../pages/InterestingBusiness/interestingBusiness.component').then(c => c.InterstingBusinesComponent) },
  { path: 'connected-businesess', loadComponent: () => import('../pages/connectedBusiness/connectedBusiness.component').then(c => c.ConnectedBusinesComponent) },
  { path: 'rejected-businesess', loadComponent: () => import('../pages/rejectedBusiness/rejectedBusiness.component').then(c => c.RejectedBusinesComponent) },
  { path: 'investor-page', loadComponent: () => import('../pages/InvestorPage/investorPage.component').then(c => c.InvestorPage) },
  { path: 'special-criteria', loadComponent: () => import('../pages/SpecialCriteria/SpecialCriteriaPage.component').then(c => c.SpecialCriteriaPage) },
  
  
  { path: 'business-questions', loadComponent: () => import('../pages/BusinessQuestions/BusinessQuestionsPage.component').then(c => c.BusinessQuestionsPage) },



  { path: 'create-special-criteria', loadComponent: () => import('../pages/SpecialCriteria/CreateSpecialCriteriaPage/CreateSpecialCriteriaPage.component').then(c => c.CreateSpecialCriteriaPageComponent) },
  { path: 'view-special-criteria/:id', loadComponent: () => import('../pages/SpecialCriteria/ViewSPecialCriteriaPage/ViewSPecialCriteriaPage.component').then(c => c.ViewSPecialCriteriaPageComponent) },
  { path: 'connection-requests', loadComponent: () => import('../pages/ConnectionRequests/ConnectionRequests.component').then(c => c.ConnectionRequests) },
  { path: 'declined-connection-requests', loadComponent: () => import('../pages/ConnectionRequests/ConnectionRequests.component').then(c => c.ConnectionRequests) },
  { path: 'global-search', loadComponent:()=>import('../pages/GlobalCompanySearch/GlobalCompanySearch.component').then(c=>c.GlobalCompanySearchComponnent) },
  { path: 'deals-pipeline', component: DealsLayoutComponent, loadChildren:()=>import('./deals.routing').then(c=>c.DealsRoutes) }
  
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
