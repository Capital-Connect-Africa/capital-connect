import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { User } from '../../../users/models';
import { OrganizationInfoContainerComponent } from "../organization-info-container/organization-info-container.component";
import { SubmissionService, UserSubmissionResponse } from '../../../../shared';
import { BUSINESS_INFORMATION_SUBSECTION_IDS, getInvestorEligibilitySubsectionIds, IMPACT_ASSESMENT_SUBSECTION_IDS, INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from '../../../../shared/business/services/onboarding.questions.service';
import { CompanyResponse } from '../../interfaces';

@Component({
  selector: 'app-organization-submissions-info',
  standalone: true,
  imports: [CommonModule, OrganizationInfoContainerComponent, TabViewModule],
  templateUrl: './organization-submissions-info.component.html',
  styleUrl: './organization-submissions-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class OrganizationSubmissionsInfoComponent implements OnChanges {
  owner!: User;
  investorPreparednessResponses: UserSubmissionResponse[] = [];
  businessResponses: UserSubmissionResponse[]= [];
  investorEligibilityResponses: UserSubmissionResponse[]= [];
  impactAssessmentResponses: UserSubmissionResponse[] =[];

  activeTab: string = 'investorEligibility';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && changes['company'].currentValue) {
      this.company = changes['company'].currentValue;
      this.owner = this.company.user

      this.investorEligilityResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, getInvestorEligibilitySubsectionIds(this.company.growthStage).ID).pipe(tap(res => {
        this.investorEligibilityResponses = res
      }))

      this.businessResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, BUSINESS_INFORMATION_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.businessResponses = res
      }))

      this.investorPreparednessResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID).pipe(tap(res => {
        this.investorPreparednessResponses = res
      }))

      this.impactAssessmentResponses$ = this._userSubmissionsService.fetchSubmissionsByUserPerSection(this.owner.id, IMPACT_ASSESMENT_SUBSECTION_IDS.ID).pipe(tap(res => {
        
        this.impactAssessmentResponses = res
      }))
    }
  }

  @Input({ required: true }) company!: CompanyResponse

  private _userSubmissionsService = inject(SubmissionService);

  submissions$: Observable<UserSubmissionResponse[]> = new Observable();

  investorEligilityResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  businessResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  investorPreparednessResponses$: Observable<UserSubmissionResponse[]> = new Observable();
  impactAssessmentResponses$: Observable<UserSubmissionResponse[]> = new Observable();

}
