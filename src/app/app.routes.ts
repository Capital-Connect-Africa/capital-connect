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
import { PublicLayoutComponent } from './features/public/layout/layout.component';
import { isPartnerCanActivateChildGuard, isPartnerCanActivateGuard } from './shared/guards/isPartnerGuard';
import { isStaffCanActivateChildGuard, isStaffCanActivateGuard } from './shared/guards/isStaffGuard';
import { StaffLayoutComponent } from './features/staff/components/staff-layout/staff-layout.component';

export const routes: Routes = [
  {
    path: 'landing',
    redirectTo: 'auth',
    pathMatch: 'full',
  },

  {
    path: 'register/:special-role',
    loadComponent: () =>
      import(
        './features/auth/pages/special-signup/special-signup.component'
      ).then((c) => c.SpecialSignupComponent),
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
    path: 'signup',
    redirectTo: 'auth/signup',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/landing/modules/landing/landing.routing.module').then(
        (m) => m.LandingRoutingModule
      ),
    canActivate: [isLoggedInCanActivateGuard],
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },

  {
    path: 'search-investors',
    component: PublicLayoutComponent,
    loadChildren: () =>
      import('./features/public/funders.routes').then(
        (m) => m.FundersRoutes
      ),
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

  { path: 'create-staff-profile', loadComponent: () => import('./features/staff/components/createProfile/createStaffProfile.component').then(c => c.createStaffProfileComponent)},

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
    path: 'staff',
    component: StaffLayoutComponent,
    loadChildren: () =>
      import('./features/staff/staff.routes').then(
        (m) => m.StaffRoutes
      ),
    canActivate: [isLoggedInCanActivateGuard, isStaffCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isStaffCanActivateChildGuard],
  },

  {
    path: 'partner',
    loadChildren: () =>
      import('./features/partner/partner.routing').then(
        (m) => m.PartnerRouting
      ),
    canActivate: [isLoggedInCanActivateGuard, isPartnerCanActivateGuard],
    canActivateChild: [isLoggedInCanActivateChildGuard, isPartnerCanActivateChildGuard],
  },
  {
    // path: 'calendly-booking',
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
    path: 'admin/manage-partners',
    loadChildren: () =>
      import('./features/users/modules/partners.routes').then(
        (m) => m.PartnersRoutes
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'admin/manage-admins',
    loadChildren: () =>
      import('./features/users/modules/admins.routes').then(
        (m) => m.AdminsRoutes
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },
  {
    path: 'admin/manage-staff',
    loadChildren: () =>
      import('./features/users/modules/staff.routes').then(
        (m) => m.StaffRoutes
      ),
    canActivate: [isLoggedInCanActivateGuard, isAdminCanActivateGuard],
    canActivateChild: [
      isLoggedInCanActivateChildGuard,
      isAdminCanActivateChildGuard,
    ],
  },


  {
    path: 'admin/advisors',
    loadChildren: () =>
      import('./features/users/modules/advisors.routes').then((m) => m.AdvisorsAdminRoutingModule),
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
    path: 'repository',
    loadChildren: () =>
      import('./features/admin/modules/repository.routing').then(
        (m) => m.RepositoryRoutes
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
