import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../../pages/landing/landing.component').then(c => c.LandingComponent)},
  { path: 'signin', loadComponent: () => import('../../pages/landing/landing.component').then(c => c.LandingComponent)},
  { path: 'signup', loadComponent: () => import('../../pages/landing/landing.component').then(c => c.LandingComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }