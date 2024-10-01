import { Component, inject } from '@angular/core';
import { FeedbackService, SidenavComponent } from '../../../../core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule, Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { PesapalService } from '../../../../shared/services/pesapal.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    OverviewComponent,
    SchedulesSectionComponent,
    CommonModule,
    SidenavComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _location =inject(Location);
  private _activatedRoute =inject(ActivatedRoute);
  private _pesapalService =inject(PesapalService);
  params =this._activatedRoute.snapshot.queryParams;
  private _feedbackService =inject(FeedbackService);
  OrderTrackingId =this.params['OrderTrackingId'];
  OrderMerchantReference =this.params['OrderMerchantReference'];
  callback$ =this._pesapalService.callback(this.OrderTrackingId, this.OrderMerchantReference).pipe(tap(res =>{
    this._feedbackService.success(res.message, 'Payments');
    this._location.back();
    }),
    catchError(err =>{
      return EMPTY
  }));

  links =[
    // {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    // {label: 'My business', href: '/business/my-business', exact: false, icon: 'business_center'},
    // {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'}

  ]

  
}
