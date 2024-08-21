import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'onboarding', loadComponent: () => import('../pages/InvestorProfile/landing/landing.component').then(c => c.LandingComponent) },
  { path: 'investor-details', loadComponent: () => import('../pages/InvestorProfile/InvestorProfile/InvestorProfile.component').then(c => c.InvestorProfileComponent) },
  { path: 'contact-person', loadComponent: () => import('../pages/InvestorProfile/success-screen/success-screen.component').then(c => c.SuccessScreenComponent) },
  { path: 'matched-business', loadComponent: () => import('../pages/MatchedBusiness/matchedBusiness.component').then(c => c.MatchedBusinesComponent) },
  { path: 'interesting-businesess', loadComponent: () => import('../pages/InterestingBusiness/interestingBusiness.component').then(c => c.InterstingBusinesComponent) },
  {path: 'connected-businesess', loadComponent:()=>import('../pages/connectedBusiness/connectedBusiness.component').then(c=>c.ConnectedBusinesComponent)},
  {path: 'rejected-businesess', loadComponent:()=>import('../pages/rejectedBusiness/rejectedBusiness.component').then(c=>c.RejectedBusinesComponent)}


]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
