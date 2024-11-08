import { Component, inject } from '@angular/core';
import { FeedbackService, SidenavComponent } from '../../../../core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule, Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { PesapalService } from '../../../../shared/services/pesapal.service';
import { catchError, EMPTY, interval, map, startWith, tap } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatIcon,NavbarComponent,OverviewComponent,SchedulesSectionComponent,CommonModule,SidenavComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  //Services
  private _location =inject(Location);
  private _activatedRoute =inject(ActivatedRoute);
  private _pesapalService =inject(PesapalService);
  private _feedbackService =inject(FeedbackService);
  private _formBuilder = inject(FormBuilder);

  //Vars
  newAttendee = { email: '', displayName: '' };
  attendees: { email: string, displayName: string }[] = [];
  isEmailValid: boolean = true;
 
  advisorySessionForm = this._formBuilder.group({
      title: ['',Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      timezone:['UTC', Validators.required],
      invitees: [[]]    
  })



  params =this._activatedRoute.snapshot.queryParams;
  OrderTrackingId =this.params['OrderTrackingId'];
  OrderMerchantReference =this.params['OrderMerchantReference'];
  callback$ =this._pesapalService.callback(this.OrderTrackingId, this.OrderMerchantReference).pipe(tap(res =>{
    this._feedbackService.success(res.message, 'Payments');
    this._location.back();
    }),
    catchError(err =>{
      return EMPTY
  }));

  advisorySessions = [
    { title: 'Session 1', startTime: new Date('2024-11-07T12:00:00Z'), endTime: new Date('2024-11-07T13:00:00Z'), timeZone: 'UTC', timer: null },
    // Add more sessions as needed
  ];


  ngOnInit(): void {
    // this.initializeTimers();
  }


  formatForInput(date: Date): string {
    return date.toISOString().slice(0, 16); // Format as "yyyy-MM-ddThh:mm"
  }


  removeAttendee(attendee: { email: string, displayName: string }): void {
    this.attendees = this.attendees.filter(a => a !== attendee);
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

  addEmail(): void {
    const email = this.advisorySessionForm.get('invitees')?.value;  // Using optional chaining to access value
  
    if (email && !this.attendees.includes(email)) {
      this.attendees.push(email);
    }
  
    // Ensure the form control is not null or undefined before resetting
    this.advisorySessionForm.get('invitees')?.reset(); // Optional chaining for reset
  }

  
  // Method to remove an email from the attendees array
  removeEmail(index: number): void {
    this.attendees.splice(index, 1);
  }


  addAttendee(): void {
    if (this.newAttendee.email && this.newAttendee.displayName) {
      this.attendees.push({ ...this.newAttendee });
      // Clear the fields after adding
      this.newAttendee = { email: '', displayName: '' };
    } else {
      alert('Please provide both email and name for the attendee.');
    }
  }


  onSubmit(): void {
    if (this.advisorySessionForm.valid) {
      // Get the form values
      const formData = this.advisorySessionForm.value;
  
      // Check if start and end values are not null or undefined before passing them to the convertToUTC function
      const dataToSubmit = {
        ...formData,
        start: formData.start ? this.convertToUTC(formData.start) : null, // Ensure the value is not null
        end: formData.end ? this.convertToUTC(formData.end) : null, // Ensure the value is not null
        invitees: this.attendees,
      };
  
      console.log('Form Submitted', dataToSubmit);
      // Call the API with `dataToSubmit`
    }
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
