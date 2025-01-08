import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, tap } from 'rxjs';
import { CompanyHttpService } from '../../services/company.service';
import { CompanyDashBoardData, CompanyResponse } from '../../interfaces';
import { SharedModule } from '../../../../shared';
import { TabViewModule } from 'primeng/tabview';
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";
import { OrganizationInfoContainerComponent } from "../../components/organization-info-container/organization-info-container.component";
import { OrganizationInfoComponent } from "../../components/organization-info/organization-info.component";
import { OrganizationOwnerInfoComponent } from "../../components/organization-owner-info/organization-owner-info.component";
import { OrganizationSubmissionsInfoComponent } from "../../components/organization-submissions-info/organization-submissions-info.component";

@Component({
  selector: 'app-single-organization',
  standalone: true,
  imports: [CommonModule, TabViewModule, SharedModule, AdminUiContainerComponent, OrganizationInfoComponent, OrganizationOwnerInfoComponent, OrganizationSubmissionsInfoComponent],
  templateUrl: './single-organization.component.html',
  styleUrl: './single-organization.component.scss',
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
export class SingleOrganizationComponent {

  private _activateRoute = inject(ActivatedRoute);
  private _companiesService = inject(CompanyHttpService);

  private _companyId = Number(this._activateRoute.snapshot.paramMap.get('id'));

  company$: Observable<CompanyResponse> = this._companiesService.getSingleCompany(this._companyId).pipe(tap(c => this.company = c))

  company!: CompanyResponse;
  activeTab: CompanyDashBoardData = 'companyInfo';

  setActiveTab(tab: CompanyDashBoardData) {
    this.activeTab = tab;
  }

}
