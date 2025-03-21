import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)},
  { path: 'upcoming-sessions', loadComponent: () => import('./pages/upcoming-sessions/upcoming-sessions.component').then(c => c.UpcomingSessionsComponent)},
  { path: 'previous-sessions', loadComponent: () => import('./pages/previous-sessions/previous-sessions.component').then(c => c.PreviousSessionsComponent)},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutes { }