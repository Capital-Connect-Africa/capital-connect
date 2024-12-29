import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/business-owners/business-owners.component').then(c => c.BusinessOwnersComponent) },
  { path: 'edit/:id', loadComponent: () => import('../pages/single-user/single-user.component').then(c => c.SingleUserComponent)}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessOwnersRoutingModule { }