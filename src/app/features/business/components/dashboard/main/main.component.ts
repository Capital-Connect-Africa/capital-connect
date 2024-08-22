import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";

import { ProfileStatusComponent } from "../profile-status/profile-status.component";
import { NotificationsComponent } from "../notifications/notifications.component";
// import { AssessmentSummaryComponent } from "../../../../../shared/components/assessment-summary/assessment-summary.component";
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
// import { SchedulesSectionComponent } from "../../../../../shared/components/schedules-section/schedules-section.component";
import { ScoreSectionComponent } from "../score-section/score-section.component";
import { NavbarComponent, NavbarToggleService } from '../../../../../core';
import { SharedModule } from '../../../../../shared';
import { OverviewComponent } from "../overview/overview.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavbarComponent, ProfileStatusComponent, NotificationsComponent,
    AdvertisementSpaceComponent, OverviewSectionComponent,
    ScoreSectionComponent, SharedModule, OverviewComponent, Button, DialogModule, InputTextModule, ModalComponent,
  ],
  // imports: [
  //   NavbarComponent, ProfileStatusComponent, NotificationsComponent,
  //   AssessmentSummaryComponent, AdvertisementSpaceComponent, OverviewSectionComponent,
  //   SchedulesSectionComponent, ScoreSectionComponent, SharedModule, OverviewComponent, Button, DialogModule, InputTextModule, ModalComponent,
  // ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  visible = true
  private _toggleService = inject(NavbarToggleService)
  toggleVisibility() {
    this._toggleService.toggleVisibility();
  }

}
