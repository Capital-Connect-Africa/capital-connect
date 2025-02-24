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
import { AdvisorProfile } from '../../../../shared/interfaces/advisor.profile';
import { AdvisorService } from '../../services/advisor-profile.service';
import { LayoutComponent } from "../../../../shared/business/layout/layout.component";
import { CountriesService } from '../../../../shared/services/countries.service';
import { Country } from '../../../../shared/interfaces/countries';
import { InvestmentStructureOptions } from '../../../../shared/interfaces/Investor';
import { InvestorScreensService } from '../../../investor/services/investor.screens.service';
import { SectorsService } from '../../../sectors/services/sectors/sectors.service';
import { Sector } from '../../../sectors/interfaces';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TooltipModule, DropdownModule, AccordionModule, MultiSelectModule, FormsModule, ReactiveFormsModule, MatStepperModule, LayoutComponent],
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createProfile.component.scss'],
})
export class createAdvisorProfileComponent implements OnInit {
  //services
  private _formBuilder = inject(FormBuilder);
  private _feedbackService = inject(FeedbackService)
  private _router = inject(Router)
  private _advisorService = inject(AdvisorService)
  private _countries = inject(CountriesService)
  private _screenService = inject(InvestorScreensService)
  private _sectorService = inject(SectorsService)


  //vars
  current_details: number = 1
  cur_det: number[] = [1,2,3] 
  userEmail: string = ''
  formGroup!: FormGroup;
  userId: number = 0
  profileRoles: string[] = []
  profileServices: string[] = []
  profileFeeStructure: string[] = []
  countryOptions: Country[] = []
  capitalStrategies : InvestmentStructureOptions[] = []
  sectors: Sector[] = []

  //booleans
  advisorProfileExists:boolean = false  


  //streams
  submit$ = new Observable<unknown>()
  profileRoles$ = this._advisorService.getAllAdvisorProfileRoles().pipe(
    tap(res => {
      this.profileRoles = res as any[]
    })
  )

  profileServices$ = this._advisorService.getAllAdvisorProfileServices().pipe(
    tap(res => {
      this.profileServices = res as any[]
    })
  )

  profileFeeStructure$ = this._advisorService.getAllAdvisorProfileFeeStructure().pipe(
    tap(res => {
      this.profileFeeStructure = res as any[]
    })
  )

  countries$ = this._countries.getCountries().pipe(tap(countries => {
    this.countryOptions = countries
  }))


  investmentStructureOptions$ = this._screenService.getInvestmentStructures().pipe(tap(structures => {
    this.capitalStrategies = structures
  }))

  sectors$ = this._sectorService.getAllSectors().pipe(tap(sectors => {
    this.sectors = sectors
  }))







  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      const id = Number(userId)
      this.userId = id
    }


    this.formGroup = this._formBuilder.group({
      userId: this.userId,
      fullName: ['', Validators.required],
      roles: [[], Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      website: ['', Validators.required],
      professionalSummary: ['', Validators.required],
      personalPitch: ['', Validators.required],
      capitalRaisingStrategies: [[], Validators.required],
      industryFocus: [[],Validators.required],
      countryFocus: [[], Validators.required],
      pastProjects: ['', Validators.required],    
      totalCapitalRaised:[0, Validators.required],
      caseStudies: [[], Validators.required],
      totalTeamMembers: [0, Validators.required],
      totalYearsExperience: [0, Validators.required],
      keyTeamMembers: [[], Validators.required],
      feeStructure:[[],Validators.required],
      servicesOffered: [[], Validators.required],
    });

 
  }

  patchForm(advisorProfile: AdvisorProfile): void {
    this.formGroup.patchValue({
      userId: this.userId,
      fullName:advisorProfile.fullName,
      roles: advisorProfile.roles,
      email: advisorProfile.email,
      phone: advisorProfile.phone,
      website: advisorProfile.website,
      professionalSummary: advisorProfile.professionalSummary,
      personalPitch: advisorProfile.personalPitch,
      capitalRaisingStrategies: advisorProfile.capitalRaisingStrategies,
      industryFocus: advisorProfile.industryFocus,
      countryFocus: advisorProfile.countryFocus,
      pastProjects: advisorProfile.pastProjects,    
      totalCapitalRaised:advisorProfile.totalCapitalRaised,
      caseStudies: advisorProfile.caseStudies,
      totalTeamMembers: advisorProfile.totalTeamMembers,
      totalYearsExperience: advisorProfile.totalYearsExperience,
      keyTeamMembers: advisorProfile.keyTeamMembers,
      feeStructure:advisorProfile.feeStructure,
      servicesOffered: advisorProfile.servicesOffered,
    });

  }


  onSubmit(): void {   
    if (this.advisorProfileExists) {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;

        this.submit$ = this._advisorService.updateAdvisorProfile(formData).pipe(
          tap(res => {
            this._feedbackService.success("Advisor Profile Updated Sucessfully")
            this._router.navigate(['/advisor/profile']);
          }),
        )
      }
    } 
    else {
      if (this.formGroup.valid) {
        const formData = this.formGroup.value;
        console.log("The advisor profile form data is",formData)

        this.submit$ = this._advisorService.createAdvisorProfile(formData).pipe(
          tap(res => {
            this._feedbackService.success("Advisor Profile Created Sucessfully")
            this._router.navigate(['/advisor/profile']);
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
