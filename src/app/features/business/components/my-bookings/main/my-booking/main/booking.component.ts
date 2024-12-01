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

  //vars
  bookingId!: string;

  webLink: SafeResourceUrl | null = null;

  // meetingDetails!:MeetingResponse 

  meetingDetails:MeetingResponse = {
    "id": "865ca0f68b694cebb0025f4084435723",
    "meetingNumber": "23689842474",
    "title": "Project Meeting",
    "password": "V5KdJgpvG88",
    "phoneAndVideoSystemPassword": "85535478",
    "meetingType": "meetingSeries",
    "state": "active",
    "timezone": "UTC",
    "start": "2024-12-25T08:00:00Z",
    "end": "2024-12-25T09:00:00Z",
    "hostUserId": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NjIyYjRjMS0xOWM3LTRkMDQtYWM0YS05ZWJlYzIyNWJlOTc",
    "hostDisplayName": "Capital Connect",
    "hostEmail": "services@capitalconnect.africa",
    "hostKey": "146953",
    "siteUrl": "meet3.webex.com",
    "webLink": "https://meet3.webex.com/meet3/j.php?MTID=mb396e07d4a064543c2ada00c1d0e18b1",
    "sipAddress": "23689842474@meet3.webex.com",
    "dialInIpAddress": "62.109.219.4",
    "enabledAutoRecordMeeting": false,
    "allowAuthenticatedDevices": true,
    "enabledJoinBeforeHost": true,
    "joinBeforeHostMinutes": 5,
    "enableConnectAudioBeforeHost": true,
    "excludePassword": false,
    "publicMeeting": false,
    "enableAutomaticLock": false,
    "unlockedMeetingJoinSecurity": "allowJoin",
    "meetingOptions": {
      "enabledChat": true,
      "enabledVideo": true,
      "enabledFileTransfer": false
    },
    "attendeePrivileges": {
      "enabledShareContent": true,
      "enabledSaveDocument": true,
      "enabledPrintDocument": true,
      "enabledAnnotate": true,
      "enabledViewParticipantList": true,
      "enabledViewThumbnails": true,
      "enabledRemoteControl": true,
      "enabledViewAnyDocument": true,
      "enabledViewAnyPage": true,
      "enabledContactOperatorPrivately": false,
      "enabledChatHost": true,
      "enabledChatPresenter": true,
      "enabledChatOtherParticipants": true
    },
    "sessionTypeId": 628,
    "scheduledType": "meeting",
    "simultaneousInterpretation": {
      "enabled": false
    },
    "enabledVisualWatermark": false,
    "enabledBreakoutSessions": false,
    "audioConnectionOptions": {
      "audioConnectionType": "VoIP",
      "enabledTollFreeCallIn": false,
      "enabledGlobalCallIn": false,
      "enabledAudienceCallBack": false,
      "entryAndExitTone": "beep",
      "allowHostToUnmuteParticipants": false,
      "allowAttendeeToUnmuteSelf": true,
      "muteAttendeeUponEntry": false
    },
    "enabledLiveStream": false,
    "accessToken": "NGUxZjBiYTctOTlmNC00ZWZmLTkyNzAtZGJmM2IwYWQ3M2Y3NzMwMzJmZDEtNmQ5_P0A1_bdd2aed2-da17-481d-bd6f-b43037ee90b7"
  }


  ngOnInit() {
    this._route.params.subscribe(params => {
      this.bookingId = params['id'];
      console.log('Booking ID:', this.bookingId);
      this.getMeeting$ = this._webExService.getMeeting(this.bookingId).pipe(tap(res=>{
        this.meetingDetails = res
      }))
    });

  }

  meetingNotes: string = ''; // Two-way binding for p-editor

  saveMeetingNotes(): void {
    console.log('Meeting Notes Saved:', this.meetingNotes);
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
