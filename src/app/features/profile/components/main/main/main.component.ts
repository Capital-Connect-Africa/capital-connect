import { Component, inject, Input } from '@angular/core';

import { MatIcon } from "@angular/material/icon";
import { FeedbackService, NavbarComponent } from "../../../../../core";
import { OverviewComponent } from "../../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule } from "@angular/common";
import { SignalsService } from '../../../../../core/services/signals/signals.service';
import { AlertComponent } from "../../../../../shared/components/alert/alert.component";
import { ProfileService } from '../../../services/profile.service';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { RoutingService } from '../../../../../shared/business/services/routing.service';
import { AlertCardComponent } from "../../alert-card/alert-card.component";
import { Router, RouterModule } from '@angular/router';
import { OrganizationOnboardService } from '../../../../organization/services/organization-onboard.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CompanyHttpService } from '../../../../organization/services/company.service';
import { ReferralLinkComponent } from "../../../../../shared/components/referral-link/referral-link.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    CommonModule,
    AlertComponent,
    AlertCardComponent,
    InputSwitchModule,
    FormsModule,
    ReferralLinkComponent,
    RouterModule
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
@Input() showBanner =false;
  private _profileService =inject(ProfileService);
  private _routingService =inject(RoutingService)
  private _router =inject(Router);
  private _companyHttpService = inject(CompanyHttpService)
  private _companyOnboardingService =inject(OrganizationOnboardService);
  private _fs = inject(FeedbackService)


  submissions:{title?: string, url: string}[] =[];

  //observables
  profileVisibility$ = new Observable<unknown>()

  submissionActions$ =this._routingService.nextRoute().pipe(tap(res =>{

    this.submissions =res.filter(r =>r.url !=='/business')
  }))
  
  company$ =new Observable<any>()
 

  userProfile$ =forkJoin([this._profileService.get(), this._companyOnboardingService.getCompanyOfUser()]).pipe(map(res =>{
    return {profile: res[0], company: res[1]}
  }),
  tap(res =>{
    return res
  }))
  signalsService =inject(SignalsService);
  showDialog(){
    this.signalsService.showDialog.set(true)
  }

  editOrganizationProfile(){
    this._router.navigateByUrl('/organization/setup')
  }

  onToggle(id:number,value:boolean) {
    this.profileVisibility$ = this._companyHttpService.updateCompanyProfileVisibility(id,value).pipe(tap(res=>{
      this._fs.success("Profile Visibility Updated Successfully")
    }))
  }
}
