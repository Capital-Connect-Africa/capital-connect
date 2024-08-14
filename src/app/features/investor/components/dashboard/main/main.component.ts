import { Component } from '@angular/core';
import {
  AdvertisementSpaceComponent
} from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import {
  AssessmentSummaryComponent
} from "../../../../../shared/components/assessment-summary/assessment-summary.component";
import {MatIcon} from "@angular/material/icon";
import {NavbarComponent} from "../../../../../core";
import {
  OverviewSectionComponent
} from "../../../../../shared/components/overview-section/overview-section.component";
import {
  SchedulesSectionComponent
} from "../../../../../shared/components/schedules-section/schedules-section.component";
import {OverviewComponent} from "../overview/overview.component";
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { MatchedBusiness } from '../../../../../shared/interfaces';
import { inject } from '@angular/core';
import { BusinessAndInvestorMatchingService } from '../../../../../shared/business/services/busines.and.investor.matching.service';
import { AuthStateService } from '../../../../auth/services/auth-state.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    AdvertisementSpaceComponent,
    AssessmentSummaryComponent,
    MatIcon,
    NavbarComponent,
    OverviewSectionComponent,
    SchedulesSectionComponent,
    OverviewComponent,
    CardComponent,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _authService = inject(AuthStateService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  visible = false;
  matchedBusinesses: MatchedBusiness[] = []

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));



  showDialog() {
    this.visible = true;
  }


}
