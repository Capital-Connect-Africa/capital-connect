import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { Observable, tap } from 'rxjs';
import { Stats } from '../../interfaces/stats.interface';
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { TableModule } from 'primeng/table';
import { User } from '../../../users/models';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { UserRoleFormatPipe } from '../../../../core/pipes/user-role-format.pipe';
import { Booking, Payment, Plan } from '../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { PaymentsService } from '../../services/payments.service';
import { BookingsService } from '../../services/booking.service';
import { SubscriptionsService } from '../../services/subscriptions.service';



@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule,
    AdminUiContainerComponent,
    TableModule,
    UserRoleFormatPipe,
    NumberAbbriviationPipe,
    TimeAgoPipe
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  private _router = inject(Router);
  private _userServices = inject(UsersHttpService);
  private _paymentsService = inject(PaymentsService);
  private _bookingsService = inject(BookingsService);

  private _statsService = inject(UserStatisticsService);
  private _subscriptionsService = inject(SubscriptionsService);
  subscriptions: {name: string, icon: string, count: number}[] =[]
  payments: Payment[] = [];
  bookings: Booking[] = [];

  businessCountriesStats!: Record<string, number>;
  stats: {name: string, icon: string, count: number}[] =[];

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  recentSubscriptions: Plan[] = []
  users: User[] = [];

  cols = [
    { field: 'firstName', header: 'Name' },
    { field: 'username', header: 'Email' },
    { field: 'roles', header: 'Type' },
    { field: 'createdAt', header: 'Joined' },
  ];

  billing_cols = [
    { field: 'subscriber', header: 'Subscriber' },
    { field: 'tier', header: 'Package' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Active' },
    { field: 'date_subscribed', header: 'Purchased' },
  ];

  payment_cols = [
    { field: 'id', header: 'PID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'description', header: 'Reason' },
  ];

  booking_cols = [
    { field: 'id', header: 'Event ID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' }
  ]

  payments$ = this._paymentsService.getPayments().pipe(tap(payments => {
    this.payments = payments.data
  }))

  bookings$ = this._bookingsService.getBookings().pipe(tap(bookings => {
    this.bookings = bookings.data
  }))

  subscriptions$ = this._subscriptionsService.getSubscriptions().pipe(tap(res => {
    this.recentSubscriptions = res.plans
  }))

  summary$ = this._statsService.getSummary().pipe(tap(summary => {
    const stats =summary.subscription_counts;
    this.subscriptions = [
      {
        name: 'Basic',
        count: stats['basic'] ??0,
        icon: 'pi pi-star',
      },
      {
        name: 'Pro',
        count: stats['pro'] ??0,
        icon: 'pi pi-cog',
      },
      {
        name: 'Elite',
        count: stats['elite'] ??0,
        icon: 'pi pi-shield',
      },
      {
        name: 'Plus',
        count: stats['plus'] ??0,
        icon: 'pi pi-plus',
      }
    ]
  }))


  users$ = this._userServices.getAllUsers().pipe(tap(res => {
    this.users = res.map(user => {
      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }
    }).slice(0, 7)
  }))


  stats$ = this._statsService.fetchUserStats().pipe(tap(res => {
    this.stats = [
      {
        name: 'Investors',
        count: res.investors ??0,
        icon: 'pi pi-briefcase',
      },
      {
        name: 'Advisors',
        count: res.advisors ??0,
        icon: 'pi pi-ethereum',
      },
      {
        name: 'Admins',
        count: res.admin ??0,
        icon: 'pi pi-star-fill',
      },
      {
        name: 'Staff',
        count: res.staff ??0,
        icon: 'pi pi-users',
      },
      {
        name: 'Businesses',
        count: res.business ??0,
        icon: 'pi pi-building',
      },
      {
        name: 'Partners',
        count: res.partner ??0,
        icon: 'pi pi-crown',
      },
      {
        name: 'Contact People',
        count: res.contact_person ??0,
        icon: 'pi pi-phone',
      }
    ];
  }))

  // {
  //   Basic: subscriptions['basic'],
  //   Pro: subscriptions['pro'],
  //   Elite: subscriptions['elite'],
  //   Plus: subscriptions['plus']
  // }

}
