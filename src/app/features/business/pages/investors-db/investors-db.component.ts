import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessLinks } from '../../../../core/utils/business.links';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { GlobalInvestorsComponent } from "../../components/investors-db/global-investors/global-investors.component";
import { InHouseInvestorsComponent } from "../../components/investors-db/in-house-investors/in-house-investors.component";
import { AppexColumnChartComponent } from "../../../../shared/components/charts/appex-column-chart/appex-column-chart.component";


@Component({
  selector: 'app-investors-db',
  standalone: true,
  imports: [SidenavComponent, CommonModule, NavbarComponent, NumberAbbriviationPipe, GlobalInvestorsComponent, InHouseInvestorsComponent, AppexColumnChartComponent],
  templateUrl: './investors-db.component.html',
  styleUrl: './investors-db.component.scss'
})
export class InvestorsDbComponent {
  links =BusinessLinks

  inHouseInvestors:{matches: number, connects: number} ={matches: 0, connects: 0}

  syncInhouseInvestors(event: {matches: number, connects: number}){
    this.inHouseInvestors =event
  }
  
}
