import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessPageService } from '../../services/business-page/business.page.service';
import { LayoutComponent } from '../../../../shared/business/layout/layout.component';
import { IndexComponent } from '../../components/investor-eligibility/index/index.component';
import { StepsComponent } from '../../components/investor-eligibility/steps/steps.component';
import { IndexLayoutComponent } from '../../../../shared/business/components/index-layout/index-layout.component';
import { FormsLayoutComponent } from '../../../../shared/business/components/forms-layout/forms-layout.component';
import { SuccessScreenComponent } from '../../components/investor-eligibility/success-screen/success-screen.component';
import { SubMissionStateService } from "../../../../shared";
import { Router } from "@angular/router";

@Component({
  selector: 'app-investor-eligibility',
  standalone: true,
  imports: [CommonModule, LayoutComponent, IndexLayoutComponent, FormsLayoutComponent, IndexComponent, StepsComponent, SuccessScreenComponent],
  templateUrl: './investor-eligibility.component.html',
  styleUrl: './investor-eligibility.component.scss'
})
export class InvestorEligibilityComponent {
  private _router = inject(Router)
  constructor(private screenService: BusinessPageService) { }

  currentPage$ = this.screenService.current_page$
  private _submissionStateService = inject(SubMissionStateService)
  // @ts-ignore
  private screenService = inject(BusinessPageService)

  usersSubmission$ = this._submissionStateService.getUserSubmissions();

  activeRouteData: { data: { page: number, step: number } } = this._router.getCurrentNavigation()?.extras.state as any

  ngOnInit() {
    this.screenService.setCurrentPage(this.activeRouteData?.data?.page || 1);
    this.screenService.setCurrentStep(this.activeRouteData?.data?.step || 1);
  }
}
