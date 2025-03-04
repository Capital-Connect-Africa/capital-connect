import { Component, inject } from '@angular/core';
import { FeedbackService, SidenavComponent } from '../../../../core';
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";
import { CommonModule} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebExService } from '../../../../shared/services/webex.service';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatIcon, NavbarComponent, OverviewComponent, SchedulesSectionComponent, CommonModule, SidenavComponent, FormsModule, ReactiveFormsModule, AlertComponent, CardComponent, AdvertisementSpaceComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  //Services
  private _activatedRoute = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);
  


  //Observables
  createMeeting$ = new Observable<unknown>()

  //vars
  bookingId: string | null = '1';

  advisorySessionForm = this._formBuilder.group({
    title: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    timezone: ['', Validators.required],
    invitees: this._formBuilder.array([], Validators.required),
  })



  params = this._activatedRoute.snapshot.queryParams;
  OrderTrackingId = this.params['OrderTrackingId'];
  OrderMerchantReference = this.params['OrderMerchantReference'];
  



  ngOnInit(): void {
    this.bookingId = this.params['bookingId'] || sessionStorage.getItem('bookingId') || null;
  }


  get safeUrl(): SafeUrl {
    const url = `https://calendly.com/investor-eligibility/advisory-sessions?month=2025-02&utm_content=${this.bookingId}`;
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
