import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FeedbackService, NavbarComponent } from '../../../../../../../core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from '../../../../../../../shared/components/advertisement-space/advertisement-space.component';
import { Booking } from '../../../../../../../shared/interfaces/Billing';
import { TransactionStatus } from '../../../../../../../shared/interfaces/payment';
import { BookingService } from '../../../../../../../shared/services/booking.service';
import { PaymentService } from '../../../../../../../shared/services/payment.service';
import { WebExService } from '../../../../../../../shared/services/webex.service';
import { EditorModule } from 'primeng/editor';
import { MeetingResponse } from '../../../../../../../shared/interfaces/booking';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    AdvertisementSpaceComponent,
    EditorModule,
    FormsModule
],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [PaginationService]
})
export class MyBookingComponent {
  //services
  private _webExService = inject(WebExService)
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)
  private _route = inject(ActivatedRoute)


  //observables
  transactionStatus$ = new Observable<unknown>();
  getMeeting$ = new Observable<unknown>()
  saveNotes$ = new Observable<unknown>()

  //vars
  bookingId!: number;
  calendlyId!:string

  webLink: SafeResourceUrl | null = null;

  meetingDetails!:MeetingResponse 


  ngOnInit() {
    this._route.params.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.calendlyId = params['id'];
      this.getMeeting$ = this._webExService.getMeeting(this.calendlyId).pipe(tap(res=>{
        this.meetingDetails = res
      }))
    });

  }

  meetingNotes: string = ''; // Two-way binding for p-editor

  saveMeetingNotes(): void {
    let data = {
      calendlyEventId: this.calendlyId,
      notes:this.meetingNotes
    }
    this.saveNotes$ = this._webExService.saveMeetingNotes(data,this.bookingId).pipe(tap(res=>{
      this._feedbackService.success("Meeting notes added Successfully")
    }))
    // Logic to persist meeting notes goes here (e.g., API call)
  }


  redirectToWebexMeeting(): void {
    window.open(this.meetingDetails.webLink, '_blank');
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

}
