import { Component, inject } from '@angular/core';
import { FeedbackService, SidenavComponent } from '../../../../core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule, Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { PesapalService } from '../../../../shared/services/pesapal.service';
import { catchError, EMPTY, interval, map, Observable, startWith, tap } from 'rxjs';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebExService } from '../../../../shared/services/webex.service';
import { Meeting } from '../../../../shared/interfaces/booking';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatIcon, NavbarComponent, OverviewComponent, SchedulesSectionComponent, CommonModule, SidenavComponent, FormsModule, ReactiveFormsModule, AlertComponent, CardComponent, AdvertisementSpaceComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  //Services
  private _location = inject(Location);
  private _activatedRoute = inject(ActivatedRoute);
  private _pesapalService = inject(PesapalService);
  private _feedbackService = inject(FeedbackService);
  private _formBuilder = inject(FormBuilder);
  private _webExService = inject(WebExService)


  //Observables
  createMeeting$ = new Observable<unknown>()


  //vars
  bookingId: string | null = '';


  advisorySessionForm = this._formBuilder.group({
    title: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    timezone: ['', Validators.required],
    invitees: this._formBuilder.array([], Validators.required),
    bookingId:[this.bookingId]
  })



  params = this._activatedRoute.snapshot.queryParams;
  OrderTrackingId = this.params['OrderTrackingId'];
  OrderMerchantReference = this.params['OrderMerchantReference'];
  callback$ = this._pesapalService.callback(this.OrderTrackingId, this.OrderMerchantReference).pipe(tap(res => {
    this._feedbackService.success(res.message, 'Payments');
    this._location.back();
  }),
    catchError(err => {
      return EMPTY
    }));

  advisorySessions = [
    { title: 'Session 1', startTime: new Date('2024-11-07T12:00:00Z'), endTime: new Date('2024-11-07T13:00:00Z'), timeZone: 'UTC', timer: null },
  ];
  



  ngOnInit(): void {
    // this.initializeTimers();
    this.bookingId = sessionStorage.getItem('bookingId')

  }

  get invitees(): FormArray {
    return this.advisorySessionForm.get('invitees') as FormArray;
  }

  // Add validators to email and displayName
  addInvitee(): void {
    const invitees = this.advisorySessionForm.get('invitees') as FormArray;
    invitees.push(
      this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],  // Validators added here
        displayName: ['', Validators.required]
      })
    );
  }


 isWithinWorkingHours(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const day = date.getUTCDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
    const hour = date.getUTCHours(); // Get the hour in UTC
  
    // Check if the date falls on a weekend or outside working hours (8 AM to 5 PM)
    if (day === 0 || day === 6 || hour < 8 || hour >= 17) {
      return { outsideWorkingHours: true };
    }
    return null;
  }


  removeInvitee(index: number): void {
    this.invitees.removeAt(index);
  }

  // Submit the form
  onSubmit(): void {
    if (this.advisorySessionForm.valid) {
      const formData = this.advisorySessionForm.value;

      const dataToSubmit = {
        ...formData,
        start: formData.start ? this.convertToUTC(formData.start) : null,
        end: formData.end ? this.convertToUTC(formData.end) : null,
      };

      formData.bookingId = this.bookingId

      this.createMeeting$ = this._webExService.createMeeting(dataToSubmit).pipe(tap(res=>{
        this._feedbackService.success("Meeting Created Successfully")
      }))

    } else {
      console.log('Form is invalid');
    }
  }

  convertToUTC(dateTime: string): string {
    const localDate = new Date(dateTime);
    return localDate.toISOString(); // This will give the format "2024-11-09T08:00:00.000Z"
  }

  // initializeTimers(): void {
  //   this.advisorySessions.forEach(session => {
  //     session.timer = interval(1000).pipe(
  //       startWith(0),
  //       map(() => this.calculateTimeLeft(session.startTime))
  //     );
  //   });
  // }



  newSession = { title: '', startTime: '', endTime: '', timeZone: 'UTC' };


  calculateTimeLeft(startTime: Date): string {
    const now = new Date();
    const difference = startTime.getTime() - now.getTime();
    if (difference <= 0) {
      return 'Session started';
    }
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  addSession(): void {
    this.advisorySessions.push({
      ...this.newSession,
      startTime: new Date(this.newSession.startTime),
      endTime: new Date(this.newSession.endTime),
      timer: null
    });
    // this.initializeTimers()
    this.newSession = { title: '', startTime: '', endTime: '', timeZone: 'UTC' };
  }


















  timeZones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'Africa/Abidjan', label: 'Africa/Abidjan' },
    { value: 'Africa/Accra', label: 'Africa/Accra' },
    { value: 'Africa/Addis_Ababa', label: 'Africa/Addis Ababa' },
    { value: 'Africa/Algiers', label: 'Africa/Algiers' },
    { value: 'Africa/Lagos', label: 'Africa/Lagos' },
    { value: 'Africa/Nairobi', label: 'Africa/Nairobi' },
    { value: 'America/New_York', label: 'America/New York (Eastern Time)' },
    { value: 'America/Chicago', label: 'America/Chicago (Central Time)' },
    { value: 'America/Denver', label: 'America/Denver (Mountain Time)' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles (Pacific Time)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos Aires' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (Indian Standard Time)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (Japan Standard Time)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (Singapore Time)' },
    { value: 'Asia/Seoul', label: 'Asia/Seoul (Korea Standard Time)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (Australian Eastern Standard Time)' },
    { value: 'Europe/London', label: 'Europe/London (Greenwich Mean Time)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (Central European Time)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (Central European Time)' },
    { value: 'Europe/Moscow', label: 'Europe/Moscow (Moscow Time)' },
    { value: 'Europe/Stockholm', label: 'Europe/Stockholm (Central European Time)' },
    { value: 'Pacific/Auckland', label: 'Pacific/Auckland (New Zealand Standard Time)' },
    { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (Hawaii-Aleutian Standard Time)' },
    { value: 'Pacific/Fiji', label: 'Pacific/Fiji (Fiji Time)' }
  ];

}
