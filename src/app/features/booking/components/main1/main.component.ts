import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../../core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavbarComponent, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    CardModule,
    AlertComponent, 
    AdvertisementSpaceComponent,
    RatingModule,
    CalendarModule,
    FullCalendarModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);

  calendarOptions: { 
    plugins: any[], 
    initialView: string, 
    headerToolbar: { left: string, center: string, right: string }, 
    events: CalendarEvent[], 
    weekends: boolean, 
    editable: boolean, 
    selectable: boolean, 
    selectMirror: boolean, 
    dayMaxEvents: boolean 
  } = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
  };

  pageSize = 4;
  currentPage = 1;
  showAdvisors = true;
  createMeeting$ = new Observable<unknown>();
  bookingId: string | null = '1';
  selectedAdvisor: Advisor | null = null;
  showCalendar = false;

  advisors: Advisor[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Financial Advisor',
      specialty: 'Retirement Planning',
      availability: 'Online',
      experienceYears: 12,
      summary: 'Certified financial planner with expertise in retirement strategies and wealth management.',
      personalPitch: 'I help clients achieve financial freedom through personalized retirement plans.',
      imageUrl: 'assets/images/advisors/sarah.jpg',
      rating: 4.8,
      calendarEvents: [
        { title: 'Available', start: '2025-03-28T09:00:00', end: '2025-03-28T12:00:00', color: '#81C784' },
        { title: 'Available', start: '2025-03-29T13:00:00', end: '2025-03-29T17:00:00', color: '#81C784' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Investment Specialist',
      specialty: 'Portfolio Management',
      availability: 'Both',
      experienceYears: 8,
      summary: 'Former hedge fund analyst specializing in growth-oriented investment strategies.',
      personalPitch: 'Let me help you build a portfolio that aligns with your risk tolerance and goals.',
      imageUrl: 'assets/images/advisors/michael.jpg',
      rating: 4.6,
      calendarEvents: [
        { title: 'Available', start: '2025-03-28T14:00:00', end: '2025-03-28T18:00:00', color: '#81C784' },
        { title: 'Available', start: '2025-03-30T10:00:00', end: '2025-03-30T15:00:00', color: '#81C784' }
      ]
    }
  ];

  params = this._activatedRoute.snapshot.queryParams;

  ngOnInit(): void {
    this.bookingId = this.params['bookingId'] || sessionStorage.getItem('bookingId') || null;
  }

  get totalPages(): number {
    return Math.ceil(this.advisors.length / this.pageSize);
  }

  get paginatedAdvisors(): Advisor[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.advisors.slice(startIndex, startIndex + this.pageSize);
  }

  viewAvailability(advisor: Advisor): void {
    this.selectedAdvisor = advisor;
    this.calendarOptions.events = advisor.calendarEvents;
    this.showCalendar = true;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  closeCalendar(): void {
    this.showCalendar = false;
    this.selectedAdvisor = null;
  }
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  color: string;
}

interface Advisor {
  id: number;
  name: string;
  title: string;
  specialty: string;
  availability: 'Online' | 'In-person' | 'Both';
  experienceYears: number;
  summary: string;
  personalPitch: string;
  imageUrl?: string;
  rating?: number;
  calendarEvents: CalendarEvent[];
}