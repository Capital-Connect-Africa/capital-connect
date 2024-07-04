import { Component, inject, Output, EventEmitter } from '@angular/core';
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { PhotoCollageComponent } from "../photo-collage/photo-collage.component";
import { BusinessHttpService } from "../../../services/business-http/business.http.service";
import { max, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import {
  BusinessAndInvestorMatchingService
} from "../../../../../shared/business/services/busines.and.investor.matching.service";
import { AuthStateService } from "../../../../auth/services/auth-state.service";
import {
  INVESTOR_PREPAREDNESS_SUBSECTION_IDS
} from "../../../../../shared/business/services/onboarding.questions.service";
import { CompanyHttpService } from "../../../../organization/services/company.service";
import { CompanyStateService } from "../../../../organization/services/company-state.service";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    OverviewSectionComponent,
    CardComponent,
    PhotoCollageComponent,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  visible = false;
  matchedInvestors: number = 0;
  investorPreparednessScore: string = '0';

  private _authStateService = inject(AuthStateService);
  private _businessService = inject(BusinessHttpService);
  private _companyService = inject(CompanyStateService);
  private _scoringService = inject(BusinessAndInvestorMatchingService);

  userId = this._authStateService.currentUserId() && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId() : Number(sessionStorage.getItem('userId'));;
  currentCompany = this._companyService.currentCompany;

  stats$ = this._businessService.getMatchedInvestors().pipe(tap(res => {
    this.matchedInvestors = res.count;
  }))

  scoring$ = this._scoringService.getUserScores(this.userId, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(scores => {
    this.investorPreparednessScore = Number(scores.percentageScore).toFixed(1);
  }))

  showDialog() {
    this.visible = true;
  }
}
