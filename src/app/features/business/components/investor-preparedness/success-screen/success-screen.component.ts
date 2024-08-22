import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Observable, tap} from "rxjs";
import {AuthStateService} from "../../../../auth/services/auth-state.service";
import {FeedbackService} from "../../../../../core";
import { CommonModule} from "@angular/common";
import {BusinessPageService} from "../../../services/business-page/business.page.service";
import {BusinessOnboardingScoringService} from "../../../../../shared/services/business.onboarding.scoring.service";
import {
  INVESTOR_PREPAREDNESS_SUBSECTION_IDS
} from "../../../../../shared/business/services/onboarding.questions.service";
import { RequestType } from '../../../../../shared';

@Component({
  selector: 'app-success-screen',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './success-screen.component.html',
  styleUrl: './success-screen.component.scss'
})
export class SuccessScreenComponent {
  score$ =new Observable();
  mode =RequestType;
  private  _router =inject(Router);
  private _pageService = inject(BusinessPageService);
  private _authStateService =inject(AuthStateService);
  private _scoringService =inject(BusinessOnboardingScoringService);
  private _feedBackService =inject(FeedbackService);
  currentUserName = this._authStateService.currentUserName()
  currentMode$ =this._pageService.current_mode$

  calculateScore() {
    this.score$ =this._scoringService.getSectionScore(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(res =>{
      this._feedBackService.info(`Your Score is: ${res}%`, `Your Eligibility Score`)
    }));

  }
  goToDashboard() {
    this._pageService.setCurrentPage(1);
    this._pageService.setCurrentStep(1);
    this._router.navigateByUrl('/business');
  }

  goToBusinessInformation() {
    this._pageService.setCurrentPage(1);
    this._pageService.setCurrentStep(1);
    this._router.navigateByUrl('/business/financials');
  }
}
