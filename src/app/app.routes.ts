import { Routes } from '@angular/router';
import {
  isLoggedInCanActivateChildGuard,
  isLoggedInCanActivateGuard,
} from './shared/guards/isLoggedIn.guard';
import {
  isAdminCanActivateChildGuard,
  isAdminCanActivateGuard,
} from './shared/guards/isAdminGuard';
import { isInvestorGuard } from './shared/guards/isInvestorGuard';

export const routes: Routes = [
  {
    path: 'landing',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'callbacks',
    loadChildren: () =>
      import('./features/callbacks/modules/callbacks.routing.module').then(
        (m) => m.CallbacksRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
  },

  {
    path: '',
    loadChildren: () =>
      import('./features/landing/modules/landing/landing.routing.module').then(
        (m) => m.LandingRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    pathMatch: 'full',
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/auth/pages/verify-email/verify-email.component').then(
        (c) => c.VerifyEmailComponent
      ),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import(
        './features/auth/pages/reset-password/reset-password.component'
      ).then((c) => c.ResetPasswordComponent),
  },
  {
    path: 'organization',
    loadChildren: () =>
      import(
        './features/organization/modules/organization/organization.routing'
      ).then((m) => m.OrganizationRoutingModule),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'investor',
    loadChildren: () =>
      import('./features/investor/modules/investor.routing').then(
        (m) => m.InvestorRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'business',
    loadChildren: () =>
      import('./features/business/modules/business.routing').then(
        (m) => m.BusinessRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./features/profile/modules/profile.routing').then(
        (m) => m.ProfileRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },

  {
    path: 'partner',
    loadChildren: () =>
      import('./features/partner/partner.routing').then(
        (m) => m.PartnerRouting
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'calendly-booking',
    loadChildren: () =>
      import('./features/booking/modules/booking.routing').then(
        (m) => m.BookingRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },

  {
    path: 'payment-instructions',
    loadChildren: () =>
      import('./features/Payment/modules/payment.routing').then(
        (m) => m.BookingRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'questions',
    loadChildren: () =>
      import('./features/questions/questions.routing').then(
        (m) => m.QuestionsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },

  {
    path: 'sectors',
    loadChildren: () =>
      import('./features/sectors/sectors.routing').then(
        (m) => m.SectorsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/modules/users.routes').then(
        (m) => m.UserssRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },

  {
    path: 'business-owners',
    loadChildren: () =>
      import('./features/users/modules/business.owners.routes').then(
        (m) => m.BusinessOwnersRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/admin/modules/admin.routing.module').then(
        (m) => m.AdminRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'advisor',
    loadChildren: () =>
      import('./features/advisor/modules/advisor.routing.module').then(
        (m) => m.AdvisorRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard],
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('./features/admin/modules/analytics.routing.module').then(
        (m) => m.AnalyticsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./features/admin/modules/bookings.routing.module').then(
        (m) => m.BookingsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'billing-vouchers',
    loadChildren: () =>
      import('./features/admin/modules/billing.vouchers.module').then(
        (m) => m.BillingVouchersRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'referrals',
    loadChildren: () =>
      import('./features/admin/modules/referal.routing.module').then(
        (m) => m.ReferalsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./features/admin/modules/payments.routing.module').then(
        (m) => m.PaymentsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('./features/admin/modules/subscriptions.routing.module').then(
        (m) => m.SubscriptionsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'financial-reports',
    loadChildren: () =>
      import('./features/admin/modules/financial-reports.routing.module').then(
        (m) => m.FinacialReportsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'dashboard-investor',
    loadChildren: () =>
      import('./features/admin/modules/admin.routing.module').then(
        (m) => m.AdminRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isInvestorGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isInvestorGuard],
  },
  {
    path: 'business-investors',
    loadChildren: () =>
      import(
        './features/business-investors/modules/business-investors.route'
      ).then((m) => m.BusinessInvestorsRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },

  {
    path: 'business-investors-investors',
    loadChildren: () =>
      import(
        './features/business-investors/modules/business-investors.route'
      ).then((m) => m.BusinessInvestorsRoutingModule),
    canActivate: [isLoggedInCanActivateGuard, isInvestorGuard],
    canActivateChild: [isLoggedInCanActivateGuard, isInvestorGuard],
  },

  {
    path: 'billing',
    loadChildren: () =>
      import('./features/billing/modules/billing.route').then(
        (m) => m.BusinessInvestorsRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },

  {
    path: 'connection-requests/:uuid/:action',
    loadComponent: () =>
      import(
        './features/business/pages/connection-requests/connection-requests.component'
      ).then((c) => c.ConnectionRequestsComponent),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent
      ),
  },
];
