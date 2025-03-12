import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/admins/admins.component').then(c => c.AdminUsersComponent) },
  { path: 'edit/:id', loadComponent: () => import('../pages/single-user/single-user.component').then(c => c.SingleUserComponent)}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminsRoutes { }