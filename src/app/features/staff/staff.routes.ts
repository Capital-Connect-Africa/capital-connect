import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutes { }