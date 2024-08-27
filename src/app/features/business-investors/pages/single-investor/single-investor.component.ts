import { Component, inject } from '@angular/core';
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { CompanyDashBoardData, CompanyResponse, InvestorDashboardData } from '../../../organization/interfaces';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-single-investor',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent],
  templateUrl: './single-investor.component.html',
  styleUrl: './single-investor.component.scss',
  animations: [
    trigger('tabChange', [
      state('companyInfo', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('ownerInfo', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.6s ease-in-out')
      ])
    ])
  ]
})
export class SingleInvestorComponent {

  private _activateRoute = inject(ActivatedRoute);
  private _companiesService = inject(CompanyHttpService);

  private _companyId = Number(this._activateRoute.snapshot.paramMap.get('id'));

  // company$: Observable<CompanyResponse> = this._companiesService.getSingleCompany(this._companyId).pipe(tap(c => this.company = c))

  company!: CompanyResponse;
  activeTab: InvestorDashboardData = 'profile';

  setActiveTab(tab: InvestorDashboardData) {
    this.activeTab = tab;
  }
}
