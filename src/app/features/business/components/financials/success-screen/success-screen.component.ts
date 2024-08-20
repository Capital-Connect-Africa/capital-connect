import { Component, inject } from '@angular/core';
import { Observable, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FeedbackService } from "../../../../../core";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import {BusinessOnboardingScoringService} from "../../../../../shared/services/business.onboarding.scoring.service";
import {BUSINESS_INFORMATION_SUBSECTION_IDS} from "../../../../../shared/business/services/onboarding.questions.service";

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
  private _feedBackService = inject(FeedbackService);
  private _scoringService =inject(BusinessOnboardingScoringService);


  score$ = new Observable();
  calculateScore() {
    this.score$ = this._scoringService.getSectionScore(BUSINESS_INFORMATION_SUBSECTION_IDS.ID).pipe(tap(res => {
      this._feedBackService.info(`Your Score is: ${res}%`, `Your Eligibility Score`)
    }));

  }

  goToImpactAssessment() {
    this._pageService.setCurrentPage(1);
    this._pageService.setCurrentStep(1);
    this._router.navigateByUrl('/business/impact-assessment');
  }
}
