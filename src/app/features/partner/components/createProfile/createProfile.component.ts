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
import { PartnerService } from '../../partner.service';
import { PartnerProfile } from '../../../../shared/interfaces/partner';
import { LayoutComponent } from "../../../../shared/business/layout/layout.component";
import { CountriesService } from '../../../../shared/services/countries.service';
import { Country } from '../../../../shared/interfaces/countries';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TooltipModule, DropdownModule, AccordionModule, MultiSelectModule, FormsModule, ReactiveFormsModule, MatStepperModule, LayoutComponent],
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createProfile.component.scss'],
})
export class createPartnerProfileComponent implements OnInit {
  //services
  private _formBuilder = inject(FormBuilder);
  private _feedbackService = inject(FeedbackService)
  private _router = inject(Router)
  private _partnerService = inject(PartnerService)
  private _countries = inject(CountriesService)

  //vars
  current_details: number = 1
  cur_det: number[] = [1,2,3] 
  userEmail: string = ''
  formGroup!: FormGroup;
  userId: number = 0
  partnerProfileId: number = 0
  keyExpertise: string[] = []
  profileServices: string[] = []
  engagements: string[] = []
  countryOptions: Country[] = []

  //booleans
  partnerProfileExists:boolean = false  


  //streams
  submit$ = new Observable<unknown>()
  partnerProfileById$ = new Observable<PartnerProfile>()

  keyExpertise$ = this._partnerService.getProfilesKeyExpertise().pipe(
    tap(res => {
      this.keyExpertise = res as any[]
    })
  )


  profileServices$ = this._partnerService.getProfilesServicesOffered().pipe(
    tap(res => {
      this.profileServices = res as any[]
    })
  )

  engagements$ = this._partnerService.getProfilesEngagementType().pipe(
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

    const advisorProfileId = localStorage.getItem("partnerProfileId")
    if(advisorProfileId){
      this.partnerProfileId = Number(advisorProfileId)
      this.partnerProfileExists = true
      this.partnerProfileById$ = this._partnerService.getPartnerProfileById(Number(advisorProfileId)).pipe(
        tap(res => {
          this.patchForm(res)
        }
        )
      )

    }


    this.formGroup = this._formBuilder.group({
      userId: this.userId,
      name: ['', Validators.required],
      category: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required],
      website: ['', Validators.required],
      internalNotes: ['', Validators.required],
      description: ['', Validators.required],
      keyExpertise: [[], Validators.required],
      services: [[], Validators.required],
      engagementType: [[], Validators.required],
    });
 
  }

  patchForm(partnerProfile: PartnerProfile): void {
    this.formGroup.patchValue({
      userId: this.userId,
      name:partnerProfile.name,
      category: partnerProfile.category,
      country: partnerProfile.country,
      region: partnerProfile.region,
      website: partnerProfile.website,
      internalNotes: partnerProfile.internalNotes,
      description: partnerProfile.description,
      keyExpertise: this.parseJsonArray(partnerProfile.keyExpertise),
      services: this.parseJsonArray(partnerProfile.services),
      engagementType: this.parseJsonArray(partnerProfile.engagementType),
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
    if (this.partnerProfileExists) {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        delete formData.userId
        this.submit$ = this._partnerService.updatePartnerProfile(this.partnerProfileId, formData).pipe(
          tap(res => {
            this._feedbackService.success("Partner Profile Updated Sucessfully")
            this._router.navigate(['/partner/contact-persons']);
          }),
        )
      }
    } 
    else {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        console.log("The partner profile form data is",formData)

        this.submit$ = this._partnerService.createPartnerProfile(formData).pipe(
          tap(res => {
            this._feedbackService.success("Partner Profile Created Sucessfully")
            this._router.navigate(['/partner/contact-persons']);
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
