import { Component, inject, Input } from '@angular/core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../../core";
import { OverviewComponent } from "../../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule } from "@angular/common";
import { SignalsService } from '../../../../../core/services/signals/signals.service';
import { AlertComponent } from "../../../../../shared/components/alert/alert.component";
import { ProfileService } from '../../../services/profile.service';
import { Observable, tap } from 'rxjs';
import { RoutingService } from '../../../../../shared/business/services/routing.service';
import { AlertCardComponent } from "../../alert-card/alert-card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    OverviewComponent,
    SchedulesSectionComponent,
    CommonModule,
    AlertComponent,
    AlertCardComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
@Input() showBanner =false;
  private _profileService =inject(ProfileService);
  private _routingService =inject(RoutingService)
  private _router =inject(Router)
  submissions:{title?: string, url: string}[] =[];

  submissionActions$ =this._routingService.nextRoute().pipe(tap(res =>{

    this.submissions =res.filter(r =>r.url !=='/business')
  }))
  

  userProfile$ =this._profileService.get().pipe(tap(res =>{
    return res;
  }))
  signalsService =inject(SignalsService);
  showDialog(){
    this.signalsService.showDialog.set(true)
  }

  editOrganizationProfile(){
    this._router.navigateByUrl('/organization/setup')
  }
}
