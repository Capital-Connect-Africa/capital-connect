import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'investors', loadComponent: () =>import('../pages/public-investors-repository/public-investors-repository.component').then(c =>c.PublicInvestorsRepositoryComponent)}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositoryRoutes { }