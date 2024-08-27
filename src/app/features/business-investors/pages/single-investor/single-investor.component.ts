import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { InvestorDashboardData } from '../../../organization/interfaces';
import { ProfileComponent } from "../../components/profile/profile.component";
import { MatchedComponent } from "../../components/matched/matched.component";
import { DeclinedComponent } from "../../components/declined/declined.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConnectedComponent } from "../../components/connected/connected.component";
import { InterestedComponent } from "../../components/interested/interested.component";
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";

@Component({
  selector: 'app-single-investor',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, ProfileComponent, MatchedComponent, DeclinedComponent, ConnectedComponent, InterestedComponent],
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

  activeTab: InvestorDashboardData = 'profile';

  setActiveTab(tab: InvestorDashboardData) {
    this.activeTab = tab;
  }
}
