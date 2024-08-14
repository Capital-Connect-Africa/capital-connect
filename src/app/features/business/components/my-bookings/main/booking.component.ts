import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { BookingService } from '../../../../../shared/services/booking.service';
import { Booking } from '../../../../../shared/interfaces/booking';
import { PaymentService } from '../../../../../shared/services/payment.service';
import { TransactionStatus } from '../../../../../shared/interfaces/payment';
import { FeedbackService, NavbarComponent } from '../../../../../core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [PaginationService]
})
export class BookingComponent {
  bookings: Booking[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  pagedBookings: any[] = [];
  showNewBookingForm: boolean = false;
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)

  private _bookingService = inject(BookingService)
  transactionStatus$ = new Observable<unknown>();

  message$ = new Observable<{ title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>;

  ngOnInit() {
    this.message$ = this._feedbackService.message$;
  }

  bookings$ = this._bookingService.getBookings(8, 10).pipe(
    tap(res => {
      this.bookings = res;
      this.totalItems = res.length;
    }),
    catchError((error: any) => {
      this._feedbackService.error('Error Fetching The Bookings.', error);
      return of([]);
    })
  );


  pageChange(page: number): void {
    this.currentPage = page;
    this.bookings$ = this._bookingService.getBookings(this.currentPage, this.itemsPerPage).pipe(
      tap(res => {
        this.bookings = res;
        this.totalItems = res.length; 
      })
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  checkStatus(orderTrackingId: string) {
    this.transactionStatus$ = this._paymentService.getTransactionStatus(orderTrackingId).pipe(
      tap((status: TransactionStatus) => {
        if (status.status === '200') {
          this._feedbackService.success('Payment successful!', 'Payment Status');
        } else if (status.payment_status_description === 'pending') {
          this._feedbackService.warning('Payment pending.', 'Payment Status');
        } else {
          this._feedbackService.error('Payment failed.', 'Payment Status');
        }
      }),
      catchError((error: any) => {
        this._feedbackService.error('Error checking payment status.', error);
        return of(null);
      }),
    );
  }


  toggleNewBookingForm(): void {
    this.showNewBookingForm = !this.showNewBookingForm;
  }

  onBookingCreated(newBooking: any): void {
    this.bookings.push(newBooking);
    this.pageChange(this.currentPage);
  }
}
