import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/my-business/my-business.component').then(c => c.MyBusinessComponent) },
  { path: 'investors/:id', loadComponent: () => import('../pages/investor-details/investor-details.component').then(c => c.InvestorDetailsComponent) },
  
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBusinessRoutingModule { }