import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { BookingService } from '../../../../../shared/services/booking.service';
import { Booking, MeetingResponse } from '../../../../../shared/interfaces/booking';
import { PaymentService } from '../../../../../shared/services/payment.service';
import { TransactionStatus } from '../../../../../shared/interfaces/payment';
import { FeedbackService, NavbarComponent } from '../../../../../core';
import { Router, RouterModule } from '@angular/router';
import { WebExService } from '../../../../../shared/services/webex.service';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../users/models';


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
    AdvertisementSpaceComponent,
    ModalComponent,
    EditorModule,
    FormsModule
],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [PaginationService]
})
export class BookingComponent {
  //services
  private _webExService = inject(WebExService)
  private _sanitizer = inject(DomSanitizer); 


  //vars
  meetingNotes: string = ''; 
  calendlyId!:string
  meetingDetails!:MeetingResponse 
  bookingId!: number;
  advisor!:User



  bookings: Booking[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  //booleans
  iframe:boolean = false;
  notes_modal:boolean = false
  meeting_details:boolean = false
  advisor_details:boolean = false


  showNewBookingForm: boolean = false;
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)
  private _router = inject(Router)

  private _bookingService = inject(BookingService)

  //observables
  transactionStatus$ = new Observable<unknown>();
  getMeeting$ = new Observable<unknown>()
  saveNotes$ = new Observable<unknown>()
  getSingleMeeting$ = new Observable<MeetingResponse>()



  webLink: SafeResourceUrl | null = null;


  ngOnInit() {
  
  }

  bookings$ = this._bookingService.getBookings(1, 10).pipe(
    tap(res => {
      // this.bookings = res;
      this.bookings = res.filter(item => item.calendlyEventId !== "ueiuwiiwu");
      this.totalItems = res.length;
    }),
    catchError((error: any) => {
      this._feedbackService.info('Error Fetching The Bookings.', error);
      return of([]);
    })
  );


  pageChange(page: number): void {
    this.currentPage = page;
    this.bookings$ = this._bookingService.getBookings(this.currentPage, this.itemsPerPage).pipe(
      tap(res => {
        this.bookings = res;
        this.totalItems = res.length ; 
      })
    );
  }

  back(){
    this.iframe = false
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

   getMeeting(booking:Booking) {
      this.meeting_details = true
      this.getSingleMeeting$ = this._webExService.getMeeting(booking.calendlyEventId).pipe(tap(res=>{
        this.meetingDetails = res
      }))
    }


   takeMeetingNotes(booking:Booking){
      this.meetingNotes = booking.notes
      this.notes_modal = true
      this.bookingId = booking.id
      this.calendlyId = booking.calendlyEventId
  
    }


    redirectToWebexMeeting(): void {
      window.open(this.meetingDetails.webLink, '_blank');
    }

    showAdvisor(booking:Booking){
      this.advisor_details = true
      this.advisor = booking.advisor
    }
    


    saveMeetingNotes(): void {
      let data = {
        calendlyEventId: this.calendlyId,
        notes:this.meetingNotes
      }
      this.saveNotes$ = this._webExService.saveMeetingNotes(data,this.bookingId).pipe(tap(res=>{
        this.notes_modal = false
        this._feedbackService.success("Meeting notes added Successfully")
      }))
      // Logic to persist meeting notes goes here (e.g., API call)
    }
}
