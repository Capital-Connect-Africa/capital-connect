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
import { WebExService } from '../../../../../shared/services/webex.service';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";


@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    AdvertisementSpaceComponent
],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [PaginationService]
})
export class BookingComponent {
  //services
  private _webExService = inject(WebExService)


  bookings: Booking[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  //booleans
  iframe:boolean = false;


  showNewBookingForm: boolean = false;
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)

  private _bookingService = inject(BookingService)

  //observables
  transactionStatus$ = new Observable<unknown>();
  getMeeting$ = new Observable<unknown>()

  message$ = new Observable<{ title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>;
  webLink: string = ''; 

  ngOnInit() {
    this.message$ = this._feedbackService.message$;
  }

  bookings$ = this._bookingService.getBookings(1, 10).pipe(
    tap(res => {
      this.bookings = res;

      // this.bookings = [
      //   {
      //     id: 1,
      //     calendlyEventId: 'CAL12345',
      //     createdAt: '2024-10-01T10:00:00Z',
      //     updatedAt: '2024-10-02T10:30:00Z',
      //     payments: [
      //       {
      //         id: 101,
      //         currency: 'USD',
      //         amount: 150,
      //         description: 'Booking deposit',
      //         status: 'completed',
      //         orderTrackingId: 'ORD12345A',
      //         createdAt: '2024-10-01T10:05:00Z',
      //         updatedAt: '2024-10-01T10:20:00Z',
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     calendlyEventId: 'CAL12346',
      //     createdAt: '2024-10-03T14:00:00Z',
      //     updatedAt: '2024-10-03T14:30:00Z',
      //     payments: [
      //       {
      //         id: 102,
      //         currency: 'EUR',
      //         amount: 200,
      //         description: 'Booking fee',
      //         status: 'initiated',
      //         orderTrackingId: 'ORD12346B',
      //         createdAt: '2024-10-03T14:10:00Z',
      //         updatedAt: '2024-10-03T14:15:00Z',
      //       },
      //       {
      //         id: 103,
      //         currency: 'EUR',
      //         amount: 200,
      //         description: 'Booking fee retry',
      //         status: 'completed',
      //         orderTrackingId: 'ORD12346C',
      //         createdAt: '2024-10-03T14:25:00Z',
      //         updatedAt: '2024-10-03T14:27:00Z',
      //       },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     calendlyEventId: 'CAL12347',
      //     createdAt: '2024-10-04T09:00:00Z',
      //     updatedAt: '2024-10-04T09:45:00Z',
      //     payments: [
      //       {
      //         id: 104,
      //         currency: 'GBP',
      //         amount: 100,
      //         description: 'Partial payment',
      //         status: 'failed',
      //         orderTrackingId: 'ORD12347D',
      //         createdAt: '2024-10-04T09:05:00Z',
      //         updatedAt: '2024-10-04T09:10:00Z',
      //       },
      //       {
      //         id: 105,
      //         currency: 'GBP',
      //         amount: 100,
      //         description: 'Final payment',
      //         status: 'completed',
      //         orderTrackingId: 'ORD12347E',
      //         createdAt: '2024-10-04T09:20:00Z',
      //         updatedAt: '2024-10-04T09:30:00Z',
      //       },
      //     ],
      //   },
      //   {
      //     id: 4,
      //     calendlyEventId: 'CAL12348',
      //     createdAt: '2024-10-05T15:00:00Z',
      //     updatedAt: '2024-10-05T15:30:00Z',
      //     payments: [
      //       {
      //         id: 106,
      //         currency: 'AUD',
      //         amount: 250,
      //         description: 'Full booking payment',
      //         status: 'completed',
      //         orderTrackingId: 'ORD12348F',
      //         createdAt: '2024-10-05T15:05:00Z',
      //         updatedAt: '2024-10-05T15:25:00Z',
      //       },
      //     ],
      //   },
      // ];

























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

  getMeeting(calendlyEventId:string) {
    this.iframe = true
    this.getMeeting$ = this._webExService.getMeeting(calendlyEventId).pipe(tap(res=>{
      console.log("The meeting is", res)

      this.webLink = res.webLink
    }))    
  }
}
