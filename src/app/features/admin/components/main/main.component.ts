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
    PieChartComponent,
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
  private _userServices =inject(UsersHttpService);
  private _paymentsService =inject(PaymentsService);
  private _bookingsService =inject(BookingsService);
  private _statsService =inject(UserStatisticsService);
  private _subscriptionsService =inject(SubscriptionsService);
  subscriptions!:Record<string, number>;
  payments:Payment[] =[];
  bookings: Booking[] =[];
  
  businessCountriesStats!:Record<string, number>;
  matches!:Stats;

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  recentSubscriptions: Plan[] =[]
  stats$ =new Observable<Stats>();
  users: User[] = [];

  cols =[
    { field: 'firstName', header: 'Name' },
    { field: 'username', header: 'Email' },
    { field: 'roles', header: 'Type' },
  ];

  billing_cols =[
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

  booking_cols =[
    { field: 'id', header: 'Event ID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' }
  ]
  
  payments$ =this._paymentsService.getPayments().pipe(tap(payments =>{
    this.payments =payments.data
  }))

  bookings$ =this._bookingsService.getBookings().pipe(tap(bookings =>{
    this.bookings =bookings.data
  }))

  subscriptions$ =this._subscriptionsService.getSubscriptions().pipe(tap(res =>{
    this.recentSubscriptions =res.plans
  }))

  summary$ =this._statsService.getSummary().pipe(tap(summary =>{
    this.subscriptions =summary.subscription_counts;
  }));
  
  users$ =this._userServices.getAllUsers().pipe(tap(res =>{
    this.users =res.map(user =>{
      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }
    }).reverse().slice(0, 5)
  }))


  ngOnInit(): void {
    this.stats$ =this._statsService.fetchUserStats().pipe(tap(res =>{
      this.matches =res;
      return res
    }))
  }

}
