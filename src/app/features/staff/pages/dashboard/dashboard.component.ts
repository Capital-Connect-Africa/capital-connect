import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BookingsService } from '../../../advisor/services/booking.service';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { tap } from 'rxjs';
import {  CustomBooking, PAYMENT_STATUS } from '../../../../shared/interfaces/Billing';
import { castBookingToCustomBooking } from '../../../../core/utils/booking.to.custom.booking';
import { formatCurrency } from '../../../../core/utils/format.currency';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _signalService =inject(SignalsService);
  private _bookingService = inject(BookingsService);
  nextSession:Partial<CustomBooking> ={};
  total: number =0;
  upcoming: number =0;
  revenue: string ='$0';
  businesses: string ='0';

  stats: {
    icon: string,
    heading: string,
    theme: string,
    paragraph: string,
    action: any
  }[] =[];

  ngOnInit(): void {
    this.updateStats()
    this._signalService.pageTitle.set('Overview');
  }

  bookings$ =this._bookingService.getBookings(1, 1000).pipe(tap(res =>{
      const bookings =res.data
      this.total =res.total;
      const upcomingSessions =bookings.filter(booking =>new Date(booking.meetingStartTime).getTime() > new Date().getTime()).sort((a, b) =>new Date(a.meetingStartTime).getTime() - new Date(b.meetingStartTime).getTime())
      this.nextSession =castBookingToCustomBooking(upcomingSessions[0])
      this.upcoming =upcomingSessions.length;
      this.revenue ='$'+formatCurrency(Math.round(bookings.map(booking =>booking.payment).filter(payment =>(payment.status.toLowerCase()) as PAYMENT_STATUS ===PAYMENT_STATUS.COMPLETED).reduce((prev:number, curr) =>prev + curr.amount, 0) *0.0077));
      this.businesses =formatCurrency(new Set(bookings.filter(booking =>booking.payment && booking.payment.status.toLowerCase() as PAYMENT_STATUS ===PAYMENT_STATUS.COMPLETED && new Date(booking.meetingEndTime).getTime() < new Date().getTime() && booking.advisor && booking.user).map(booking =>`${booking.user.username}`)).size)
      this.updateStats();
    }))


  updateStats(){
    this.stats =[
      {
        icon: 'pi pi-video',
        heading: 'Total',
        theme: 'bg-purple-800',
        paragraph: `${this.total} advisory sessions`,
        action: () =>{}
      },
      {
        icon: 'pi pi-calendar-clock',
        heading: 'Upcoming',
        theme: 'bg-teal-800',
        paragraph: `${this.upcoming} scheduled sessions`,
        action: () =>{}
      },
      {
        icon: 'pi pi-wallet',
        heading: 'Revenue',
        theme: 'bg-blue-800',
        paragraph: `${this.revenue} revenue generated`,
        action: () =>{}
      },
      {
        icon: 'pi pi-briefcase',
        heading: 'Businesses',
        theme: 'bg-green-800',
        paragraph: `${this.businesses} businesses advised`,
        action: () =>{}
      },
    ]
  }

}
