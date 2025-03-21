import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { FeedbackService } from '../../../../core';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { StaffService } from '../../staff.service';
import { StaffProfile } from '../../../../shared/interfaces/partner';
import { LayoutComponent } from "../../../../shared/business/layout/layout.component";
import { CountriesService } from '../../../../shared/services/countries.service';
import { Country } from '../../../../shared/interfaces/countries';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TooltipModule, DropdownModule, AccordionModule, MultiSelectModule, FormsModule, ReactiveFormsModule, MatStepperModule, LayoutComponent],
  templateUrl: './createStaffProfile.component.html',
  styleUrls: ['./createStaffProfile.component.scss'],
})
export class createStaffProfileComponent implements OnInit {
  //services
  private _formBuilder = inject(FormBuilder);
  private _feedbackService = inject(FeedbackService)
  private _router = inject(Router)
  private _StaffService = inject(StaffService)
  private _countries = inject(CountriesService)

  //vars
  current_details: number = 1
  cur_det: number[] = [1,2,3] 
  userEmail: string = ''
  formGroup!: FormGroup;
  userId: number = 0
  StaffProfileId: number = 0
  keyExpertise: string[] = []
  profileServices: string[] = []
  engagements: string[] = []
  countryOptions: Country[] = []

  //booleans
  StaffProfileExists:boolean = false  


  //streams
  submit$ = new Observable<unknown>()
  StaffProfileById$ = new Observable<StaffProfile>()

  keyExpertise$ = this._StaffService.getProfilesKeyExpertise().pipe(
    tap(res => {
      this.keyExpertise = res as any[]
    })
  )


  profileServices$ = this._StaffService.getProfilesServicesOffered().pipe(
    tap(res => {
      this.profileServices = res as any[]
    })
  )

  engagements$ = this._StaffService.getProfilesEngagementType().pipe(
    tap(res => {
      this.engagements = res as any[]
    })
  )


  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countryOptions = countries
  }))









  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      const id = Number(userId)
      this.userId = id
    }

    const staffProfileId = localStorage.getItem("staffProfileId")
    if(staffProfileId){
      this.StaffProfileId = Number(staffProfileId)
      this.StaffProfileExists = true
      this.StaffProfileById$ = this._StaffService.getStaffProfileById(Number(staffProfileId)).pipe(
        tap(res => {
          this.patchForm(res)
        }
        )
      )

    }


    this.formGroup = this._formBuilder.group({
      userId: this.userId,
      fullName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      headshotUrl: ['', Validators.required],
      location: ['', Validators.required],
      languages: ['', Validators.required],
      expertise: [[], Validators.required],
      internalNotes: ['', Validators.required],
      personalQuote: ['', Validators.required],
    });
 
  }

  patchForm(StaffProfile: StaffProfile): void {
    this.formGroup.patchValue({
      userId: this.userId,
      fullName:StaffProfile.fullName,
      jobTitle: StaffProfile.jobTitle,
      department: StaffProfile.department,
      headshotUrl: StaffProfile.headshotUrl,
      location: StaffProfile.location,
      languages: StaffProfile.languages,
      expertise: this.parseJsonArray(StaffProfile.expertise),
      internalNotes: StaffProfile.internalNotes,
      personalQuote: StaffProfile.personalQuote,
    });

  }


  parseJsonArray(value: any): any {
    try {
      if (typeof value === "string") {
        const parsedValue = JSON.parse(value);
  
        if (Array.isArray(parsedValue)) {
          return parsedValue.map(item => 
            typeof item === "string" && (item.startsWith("{") || item.startsWith("[")) 
              ? JSON.parse(item) 
              : item
          );
        }
        return parsedValue;
      }
  
      if (Array.isArray(value)) {
        return value.map(item => 
          typeof item === "string" && (item.startsWith("{") || item.startsWith("[")) 
            ? JSON.parse(item) 
            : item
        );
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e, value);
    }
    return value;
  }


  onSubmit(): void {  
    if (this.StaffProfileExists) {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        delete formData.userId
        this.submit$ = this._StaffService.updateStaffProfile(this.StaffProfileId, formData).pipe(
          tap(res => {
            this._feedbackService.success("Staff Profile Updated Sucessfully")
            this._router.navigate(['/staff/profile']);
          }),
        )
      }
    } 
    else {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;

        this.submit$ = this._StaffService.createStaffProfile(formData).pipe(
          tap(res => {
            this._feedbackService.success("Staff Profile Created Sucessfully")
            this._router.navigate(['/staff/profile']);
          })
        )

      }
    }
  }



  setNextDetails() {
    this.current_details = this.current_details + 1
  }

  setPrevDetails() {
    if (this.current_details != 1) {
      this.current_details = this.current_details - 1
    }
  }

}
