import { Component, inject } from '@angular/core';
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import { FeedbackService } from "../../../../../core";
import { CommonModule } from "@angular/common";
import {BusinessOnboardingScoringService} from "../../../../../shared/services/business.onboarding.scoring.service";
import {CompanyStateService} from "../../../../organization/services/company-state.service";
import {
  getInvestorEligibilitySubsectionIds
} from "../../../../../shared/business/services/onboarding.questions.service";

@Component({
  selector: 'app-success-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-screen.component.html',
  styleUrl: './success-screen.component.scss'
})
export class SuccessScreenComponent {
  private _router = inject(Router);
  private _pageService = inject(BusinessPageService);
  private _scoringService = inject(BusinessOnboardingScoringService);
  private _feedBackService = inject(FeedbackService);
  private _companyService =inject(CompanyStateService)
  score$ = new Observable();
  calculateScore() {
    this.score$ = this._scoringService.getSectionScore(getInvestorEligibilitySubsectionIds(this._companyService.currentCompany.growthStage).ID).pipe(tap(res => {
      this._feedBackService.info(`Your Score is: ${res}%`, `Your Eligibility Score`)
    }));

  }

  goToDashboard() {
    this._pageService.setCurrentPage(1);
    this._pageService.setCurrentStep(1);
    this._router.navigateByUrl('/business');
  }
}
