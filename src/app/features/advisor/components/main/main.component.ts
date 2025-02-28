import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdvisorUiContainerComponent } from "../admin-ui-container/advisor-ui-container.component";
import { Observable, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Booking, Payment} from '../../../../shared/interfaces/Billing';
import { BookingsService } from '../../services/booking.service';
import { RouterModule } from '@angular/router';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../../core/services/feedback/feedback.service';
import { WebExService } from '../../../../shared/services/webex.service';
import { MeetingResponse } from '../../../../shared/interfaces/booking';
import { User } from '../../../users/models';


@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [SharedModule,EditorModule, CommonModule,FormsModule, AdvisorUiContainerComponent, TableModule, CommonModule, RouterModule, ModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  //observables
  getMeeting$ = new Observable<MeetingResponse>()
  bookings$ = new Observable<any>();
  saveNotes$ = new Observable<unknown>()

  //booleans
  notes_modal:boolean = false
  meeting_details:boolean = false
  advisor_details:boolean = false


  //services
  private _router = inject(Router);
  private _bookingService = inject(BookingsService);
  private _feedbackService = inject(FeedbackService);
  private _webExService = inject(WebExService);
  


  //vars
  subscriptions!: Record<string, number>;
  payments: Payment[] = [];
  bookings: Booking[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  meetingNotes: string = ''; 
  calendlyId!:string
  meetingDetails!:MeetingResponse 
  bookingId!: number;
  advisor!:User



  navigateTo(path: string) {
    this._router.navigate([path]);
  }


  getBookings(page: number = 1, limit: number = 10) {
    this.bookings$ = this._bookingService.getBookings(page, limit).pipe(tap(bookings => {
      this.bookings = bookings.data;
      // this.bookings = bookings.data.filter(item => item.calendlyEventId !== "ueiuwiiwu");
      // this.updateDisplayedData();
      // this.rowsCount = bookings.total;
    }))
  }



  ngOnInit(): void {

    this.getBookings();
  }

  getMeeting(booking:Booking) {
    this.meeting_details = true
    this.getMeeting$ = this._webExService.getMeeting(booking.calendlyEventId).pipe(tap(res=>{
      this.meetingDetails = res
    }))
  }


  takeMeetingNotes(booking:Booking){
    this.meetingNotes = booking.notes
    this.notes_modal = true
    this.bookingId = booking.id
    this.calendlyId = booking.calendlyEventId

  }


  saveMeetingNotes(): void {
    let data = {
      calendlyEventId: this.calendlyId,
      notes:this.meetingNotes
    }
    this.saveNotes$ = this._webExService.saveMeetingNotes(data,this.bookingId).pipe(tap(res=>{
      this._feedbackService.success("Meeting notes added Successfully")
    }))
  }



  redirectToWebexMeeting(): void {
    window.open(this.meetingDetails.webLink, '_blank');
  }


   showAdvisor(booking:Booking){
        this.advisor_details = true
        this.advisor = booking.user
    }
      
  


}
