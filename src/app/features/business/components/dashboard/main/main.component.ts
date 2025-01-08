import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";

import { ProfileStatusComponent } from "../profile-status/profile-status.component";
import { NotificationsComponent } from "../notifications/notifications.component";
import { AssessmentSummaryComponent } from "../../../../../shared/components/assessment-summary/assessment-summary.component";
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { SchedulesSectionComponent } from "../../../../../shared/components/schedules-section/schedules-section.component";
import { ScoreSectionComponent } from "../score-section/score-section.component";
import { NavbarComponent, NavbarToggleService } from '../../../../../core';
import { SharedModule } from '../../../../../shared';
import { OverviewComponent } from "../overview/overview.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { CommonModule } from '@angular/common';
import { ProBadgeComponent } from "../../../../../core/components/pro-badge/pro-badge.component";
import { CompanyStateService } from '../../../../organization/services/company-state.service';
import { Progress } from '../../../interfaces/progress.interface';
import { Observable, tap } from 'rxjs';
import { BusinessOnboardingScoringService } from '../../../../../shared/services/business.onboarding.scoring.service';
import { UserTransactionHistoryComponent } from "../../../../../shared/components/user-transaction-history/user-transaction-history.component";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, NavbarComponent, ProfileStatusComponent, NotificationsComponent,
    AssessmentSummaryComponent, AdvertisementSpaceComponent, OverviewSectionComponent,
    SchedulesSectionComponent, ScoreSectionComponent, SharedModule, OverviewComponent, Button, DialogModule, InputTextModule, ModalComponent,
    ProBadgeComponent,
    UserTransactionHistoryComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  visible = true;
  private _toggleService = inject(NavbarToggleService);
  private _companyStateService =inject(CompanyStateService);
  businessName  = this._companyStateService.currentCompany.name;
  private _scoringService =inject(BusinessOnboardingScoringService);
  progress$ =new Observable<any>();
  toggleVisibility() {
    this._toggleService.toggleVisibility();
  }

  progress:Progress[] =[
    {
      section: 'Investor Eligibility',
      progress: 0
    },
    {
      section: 'Investor Preparedness',
      progress: 0
    },
    {
      section: 'Impact Assessment',
      progress: 0
    },
    {
      section: 'Business Information',
      progress: 0
    },
    {
      section: 'Business Profile',
      progress: 0
    }
  ]

  ngOnInit(): void {
   this.progress$ =this._scoringService.progress.pipe(tap(res =>{
    this.progress =res.sort((a, b) => a.progress - b.progress);
   }))
    
  }
}
