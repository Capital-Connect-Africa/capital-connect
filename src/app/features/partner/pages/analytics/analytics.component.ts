import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { UserStatisticsService } from '../../../admin/services/user.statistics.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from "../../../../shared/components/charts/column-chart/column-chart.component";
import { HorizontalBarchartComponent } from "../../../../shared/components/charts/horizontal-barchart/horizontal-barchart.component";
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { GeoChartComponent } from "../../../../shared/components/charts/geo-chart/geo-chart.component";

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [PartnerLayoutComponent, CommonModule, ColumnChartComponent, HorizontalBarchartComponent, PieChartComponent, GeoChartComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
  private _statsService =inject(UserStatisticsService)
  businessStages:Record<string, number> ={};
  businessSectors:Record<string, number> ={};
  businessFundRaise:Record<string, number> ={};
  businessMaxFunding:Record<string, number> ={};
  businessMinFunding:Record<string, number> ={};
  businessSubSectors:Record<string, number> ={};
  businessImpactAreas:Record<string, number> ={};
  businessYearsOfOperation:Record<string, number> ={};
  businessNoOfEmployees:Record<string, number> ={};
  businessCountries:Record<string, number> ={};
  investorSectors:Record<string, number> ={};
  businessFundingType:Record<string, number> ={};
  investorFundingType:Record<string, number> ={};
  analytics$ =this._statsService.getAnalytics().pipe(tap(analytics =>{
    this.businessStages =analytics.stages;
    this.businessSubSectors =analytics.sub_sectors;
    this.businessImpactAreas =analytics.impact_areas;
    this.businessYearsOfOperation =analytics.years_of_operation;
    this.businessNoOfEmployees =analytics.no_of_employees;
    this.businessSectors =analytics.sectors.companies;
    this.investorSectors =analytics.sectors.investors;
    this.businessFundRaise =analytics.fund_raise;
    this.businessMaxFunding =analytics.max_funding;
    this.businessMinFunding =analytics.min_funding
    this.businessCountries =analytics.countries
    this.businessFundingType =analytics.funding.companies
    this.investorFundingType =analytics.funding.investors
  }))
}
