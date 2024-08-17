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
import { InterestingBusinesses, MatchedBusiness } from '../../../../../shared/interfaces';
import { inject } from '@angular/core';
import { BusinessAndInvestorMatchingService } from '../../../../../shared/business/services/busines.and.investor.matching.service';
import { AuthStateService } from '../../../../auth/services/auth-state.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { FeedbackService } from '../../../../../core';

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
    CommonModule,
    ModalComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _authService = inject(AuthStateService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  visible = false;
  matchedBusinesses: MatchedBusiness[] = []
  selectedMatchedBusiness: MatchedBusiness | null = null;

  markAsInteresting$ = new Observable<unknown>()
  interestingBusinesses: InterestingBusinesses[] = [];

  table:boolean = true

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));
  private _feedBackService = inject(FeedbackService);




  showDialog() {
    this.visible = true;
  }

  trackByIndex(index: number): number {
    return index;
  }


  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;
  }


  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.');        
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => {this.interestingBusinesses = res;})
        );   
      })        
    );
  }

  hideDetails(): void {
    this.table = true
    this.selectedMatchedBusiness = null;
  }

  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
    tap(res => {this.interestingBusinesses = res;})
  );

}
