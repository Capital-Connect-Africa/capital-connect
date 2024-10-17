import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../../services/booking.service';
import { Booking } from '../../../../../shared/interfaces/Billing';
import { tap } from 'rxjs';
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss'
})
export class BookingDetailComponent {
  booking: Booking | null =null;
  private _activatedRoute =inject(ActivatedRoute);
  private _bookingService =inject(BookingsService);

  bookingId =Number(this._activatedRoute.snapshot.params['id']);
  booking$ =this._bookingService.getBooking(this.bookingId).pipe(tap(booking =>{
    this.booking =booking
  }))
}
