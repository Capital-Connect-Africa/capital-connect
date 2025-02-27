import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/search-engine/search-engine.component').then(c => c.SearchEngineComponent)},
  { path: ':q', loadComponent: () => import('./pages/funders/funders.component').then(c => c.FundersComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundersRoutes { }