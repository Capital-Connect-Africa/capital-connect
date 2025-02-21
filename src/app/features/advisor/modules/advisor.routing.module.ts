import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'client-details/:id', loadComponent: () => import('../pages/ClientDetails/ClientDetails.component').then(c => c.ClientDetailsComponent)},
  { path: 'create-profile', loadComponent: () => import('../components/createProfile/createProfile.component').then(c => c.createAdvisorProfileComponent)},


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRoutingModule { }