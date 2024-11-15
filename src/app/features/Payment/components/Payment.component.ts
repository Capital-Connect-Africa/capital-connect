import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, interval, mergeMap, Observable, of, switchMap, take, takeWhile, tap } from 'rxjs';
import { PaymentService } from '../../../shared/services/payment.service';
import { TransactionStatus } from '../../../shared/interfaces/payment';
import { CALENDLYEVENTID, FeedbackService } from '../../../core';
import { BookingService } from '../../../shared/services/booking.service';
import { CreateBookingResponse } from '../../../shared/interfaces/booking';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from "../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../core/components/navbar/navbar.component";
import { AssessmentSummaryComponent } from "../../../shared/components/assessment-summary/assessment-summary.component";
import { AdvertisementSpaceComponent } from "../../../shared/components/advertisement-space/advertisement-space.component";
import { LoadingService } from '../../../core';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  standalone:true,
  selector: 'app-payment-instructions',
  templateUrl: './Payment.component.html',
  styleUrls: ['./Payment.component.scss'],
  imports: [CommonModule, SidenavComponent, NavbarComponent, AssessmentSummaryComponent, AdvertisementSpaceComponent, SkeletonModule]
})
export class PaymentComponent implements OnInit {
  redirectUrl: SafeResourceUrl | null = null;
  transactionStatus$ = new Observable<unknown>() ;
  orderTrackingId: string = ''

  //streams
  createBooking$ = new Observable<TransactionStatus | null>();

  //services
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)
  private _bookingService = inject(BookingService)
  private _sanitizer = inject(DomSanitizer); 
  private _loader = inject(LoadingService)


  //booleans
  checkStatus: boolean = false
  visible: boolean = false

  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'Plans', href: '/business/plans', exact: false, icon: 'paid'},
    {label: 'My business', href: '/business/my-business', exact: false, icon: 'business_center'},
    // {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'}
  ]

  constructor() { }

  ngOnInit() {
 
  }


  checkPaymentStatus() {
    this.transactionStatus$ = this._paymentService.getTransactionStatus(this.orderTrackingId).pipe(
      tap((status: TransactionStatus) => {
        if (status.status === '200') {
          this.checkStatus = false;
          this._feedbackService.success('Payment successful!', 'Payment Status');
        } else if (status.payment_status_description === 'pending') {
          this._feedbackService.warning('Payment pending.', 'Payment Status');
        } else {
          this._feedbackService.error('Payment failed.', 'Payment Status');
        }
      }),
      catchError((error: any) => {
        this._feedbackService.error('Error checking payment status.', 'Payment Status');
        return of(null);
      }),
    );
  }


  createBooking() {
    this._loader.setLoading(true)
    this.visible = true


    this.createBooking$ = this._bookingService.createBooking({ calendlyEventId: CALENDLYEVENTID }).pipe(
      mergeMap((response: CreateBookingResponse) => {

        if (response && response.redirectUrl) {
          this.redirectUrl = this._sanitizer.bypassSecurityTrustResourceUrl(response.redirectUrl);


          this.orderTrackingId = response.orderTrackingId;
          this._loader.setLoading(false);  // Execute when the observable emits
          
          sessionStorage.setItem('bookingId',response.bookingId)

          return interval(20000).pipe(
            take(3),
            switchMap(() => this._paymentService.getTransactionStatus(this.orderTrackingId)),
            takeWhile((status: TransactionStatus) => status?.status === '500', true),
            tap((status: TransactionStatus | null) => {
              if (status) {
                if (status.status === '500') {
                  this.checkStatus = true;
                } else if (status.status === '200') {
                  this.checkStatus = false;
                }
              }
            }),
            catchError((error: any) => {
              this._feedbackService.error('Error checking transaction status', error);
              return of(null); 
            })
          );
        } else {
          return of(null); 
        }
      }),
      catchError((error: any) => {
        this._feedbackService.error('Error creating booking', error);
        return of(null); 
      })
    );
  }



}
