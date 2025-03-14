import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/staff/staff.component').then(c => c.StaffUsersComponent) },
  { path: 'edit/:id', loadComponent: () => import('../pages/single-user/single-user.component').then(c => c.SingleUserComponent)}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StaffRoutes { }