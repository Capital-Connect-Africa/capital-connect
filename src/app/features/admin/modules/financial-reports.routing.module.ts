import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', loadComponent: () => import('../pages/FinancialReporting/financialReporting.component').then(c => c.FinancialReportingComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinacialReportsRoutingModule { }