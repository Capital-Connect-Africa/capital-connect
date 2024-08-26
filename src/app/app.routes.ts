import { Routes } from '@angular/router';
import { isLoggedInCanActivateChildGuard, isLoggedInCanActivateGuard } from './shared/guards/isLoggedIn.guard';
import { isAdminCanActivateChildGuard, isAdminCanActivateGuard } from './shared/guards/isAdminGuard';

export const routes: Routes = [
  {
    path: 'landing',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./features/landing/modules/landing/landing.routing.module').then(m => m.LandingRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    pathMatch: 'full'
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./features/auth/pages/verify-email/verify-email.component').then(c => c.VerifyEmailComponent)
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
  },
  {
    path: 'organization',
    loadChildren: () => import('./features/organization/modules/organization/organization.routing').then(m => m.OrganizationRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard]
  },
  {
    path: 'investor',
    loadChildren: () => import('./features/investor/modules/investor.routing').then(m => m.InvestorRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard]
  },
  {
    path: 'business',
    loadChildren: () => import('./features/business/modules/business.routing').then(m => m.BusinessRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard]
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./features/profile/modules/profile.routing').then(m => m.ProfileRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard]
  },

  {
    path: 'calendly-booking',
    loadChildren: () => import('./features/booking/modules/booking.routing').then(m => m.BookingRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard]
  },
  {
    path: 'questions',
    loadChildren: () => import('./features/questions/questions.routing').then(m => m.QuestionsRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isAdminCanActivateChildGuard]
  },

  {
    path: 'sectors',
    loadChildren: () => import('./features/sectors/sectors.routing').then(m => m.SectorsRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isAdminCanActivateChildGuard]
  },

  {
    path: 'users',
    loadChildren: () => import('./features/users/modules/users.routes').then(m => m.UserssRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isAdminCanActivateChildGuard]
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./features/admin/admin.routing.module').then(m => m.AdminRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isAdminCanActivateChildGuard]
  },

  {
    path: 'business-investors',
    loadChildren: () => import('./features/business-investors/modules/business-investors.route').then(m => m.BusinessInvestorsRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isAdminCanActivateChildGuard]
  }
];
