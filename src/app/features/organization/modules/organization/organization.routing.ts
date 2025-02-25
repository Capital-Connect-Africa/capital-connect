import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminCanActivateChildGuard, isAdminCanActivateGuard } from '../../../../shared/guards/isAdminGuard';
import { isInvestorGuard } from '../../../../shared/guards/isInvestorGuard';


const routes: Routes = [
  { path: 'valuation',
    loadComponent: () => import('../../pages/valuation/valuation.component').then(c => c.ValuationComponent) },

  { path: 'setup',
    loadComponent: () => import('../../pages/setup/setup.component').then(c => c.SetupComponent) },
  {
    path: 'setup/:id',
    loadComponent: () => import('../../pages/setup/setup.component').then(c => c.SetupComponent),
    canActivate: [isAdminCanActivateGuard],
    canActivateChild: [isAdminCanActivateChildGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('../../pages/organization-list/organization-list.component').then(c => c.OrganizationListComponent),
    canActivate: [isAdminCanActivateGuard],
    canActivateChild: [isAdminCanActivateChildGuard]
  }, 
  {
    path: 'list-investors',
    loadComponent: () => import('../../pages/organization-list/organization-list.component').then(c => c.OrganizationListComponent),
    canActivate: [isInvestorGuard],
    canActivateChild: [isInvestorGuard]
  },
  
  {
    path: ':id',
    loadComponent: () => import('../../pages/single-organization/single-organization.component').then(c => c.SingleOrganizationComponent),
    canActivate: [isAdminCanActivateGuard],
    canActivateChild: [isAdminCanActivateChildGuard]
  },
  {
    path: 'investor/:id',
    loadComponent: () => import('../../pages/single-organization/single-organization.component').then(c => c.SingleOrganizationComponent),
    canActivate: [isInvestorGuard],
    canActivateChild: [isInvestorGuard]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }