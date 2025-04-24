import { Component, inject, HostListener } from '@angular/core';
import { NavbarComponent } from "../../../../core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RatingModule } from 'primeng/rating';

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
    RatingModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);

  loading = false;
  allAdvisors: Advisor[] = [];
  displayedAdvisors: Advisor[] = [];
  selectedAdvisor: Advisor | null = null;
  batchSize = 8;
  currentIndex = 0;

  ngOnInit(): void {
    this.initializeAdvisors();
    this.loadMoreAdvisors();
  }

  initializeAdvisors(): void {
    this.allAdvisors = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 3,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 4,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 5,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 6,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 7,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 9,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },
      {
        id: 11,
        name: 'Sarah Johnson',
        title: 'Financial Advisor',
        specialty: 'Retirement Planning',
        availability: 'Online',
        experienceYears: 12,
        summary: 'Certified financial planner with 12 years of experience specializing in retirement strategies and wealth management. Sarah helps clients navigate complex financial decisions with personalized retirement plans tailored to individual goals and risk tolerance.',
        personalPitch: 'I believe everyone deserves financial peace of mind in their golden years. My approach combines rigorous analysis with compassionate guidance to create retirement plans that adapt to life\'s changes.',
        imageUrl: 'data:image/png;base64,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',
        rating: 4.8,
        availableSlots: [
          { day: 'Mon', time: '9:00 AM - 11:00 AM' },
          { day: 'Tue', time: '2:00 PM - 4:00 PM' },
          { day: 'Thu', time: '10:00 AM - 12:00 PM' }
        ]
      },

      // Add more advisors...
    ];
  }

  loadMoreAdvisors(): void {
    if (this.loading || this.currentIndex >= this.allAdvisors.length) return;
    
    this.loading = true;
    setTimeout(() => {
      const nextBatch = this.allAdvisors.slice(this.currentIndex, this.currentIndex + this.batchSize);
      this.displayedAdvisors = [...this.displayedAdvisors, ...nextBatch];
      this.currentIndex += this.batchSize;
      this.loading = false;
    }, 500);
  }

  selectAdvisor(advisor: Advisor): void {
    this.selectedAdvisor = advisor;
  }

  getNextAvailableSlots(advisor: Advisor): any[] {
    return advisor.availableSlots || [];
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      this.loadMoreAdvisors();
    }
  }
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
  imageUrl?: string,
  rating: number,
  availableSlots?: { day: string; time: string }[];
}