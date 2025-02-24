import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/advisors/advisors.component').then(c => c.AdvisorsAdminComponent) },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdvisorsAdminRoutingModule { }