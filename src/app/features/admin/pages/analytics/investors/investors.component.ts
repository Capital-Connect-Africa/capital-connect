import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../../../components/admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../../services/user.statistics.service';
import { Observable, tap } from 'rxjs';
import { SharedStats, Stats } from '../../../interfaces/stats.interface';
import { PieChartComponent } from "../../../../../shared/components/charts/pie-chart/pie-chart.component";
import { BubbleChartComponent } from "../../../../../shared/components/charts/bubble-chart/bubble-chart.component";
import { BarChartComponent } from "../../../../../shared/components/charts/bar-chart/bar-chart.component";
import { GeoChartComponent } from "../../../../../shared/components/charts/geo-chart/geo-chart.component";
import { TableModule } from 'primeng/table';
import { UserRoleFormatPipe } from '../../../../../core/pipes/user-role-format.pipe';
import { HorizontalBarchartComponent } from "../../../../../shared/components/charts/horizontal-barchart/horizontal-barchart.component";
import { ColumnChartComponent } from "../../../../../shared/components/charts/column-chart/column-chart.component";
import { Plan } from '../../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';
import { ChartEvent } from '../../../../../shared/interfaces/chart.event.interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule, ButtonModule,
    AdminUiContainerComponent,
    PieChartComponent,
    BubbleChartComponent,
    BarChartComponent,
    GeoChartComponent,
    TableModule,
    UserRoleFormatPipe,
    HorizontalBarchartComponent,
    ColumnChartComponent,
    TimeAgoPipe
],
  templateUrl: './investors.component.html',
  styleUrl: './investors.component.scss'
})

export class InvestorsComponent {
  private _router = inject(Router);
  private _cdr =inject(ChangeDetectorRef);
  private _statsService =inject(UserStatisticsService);
  sectorStats!:SharedStats;
  fundingStats!:SharedStats;
  minFunding!:Record<string, number>;
  maxFunding!:Record<string, number>;
  fundRaise!:Record<string, number>;
  stagesStats!:Record<string, number>;
  subscriptions!:Record<string, number>;

  heading:string ='';
  
  businessCountriesStats!:Record<string, number>;
  matches!:Stats;

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  recentSubscriptions: Plan[] =[]
  stats$ =new Observable<Stats>();
  filterStats$ =new Observable();
  sectorStats$ =new Observable();
  analytics$ =new Observable();
  countriesStats:{country: string, value: number}[] =[];
  entities:any;

  getAnalytics(){
    this.heading ='';
    this.analytics$ =this._statsService.getAnalytics().pipe(tap(analytics =>{
      this.stagesStats =analytics.stages;
      this.sectorStats =analytics.sectors;
      this.fundingStats =analytics.funding;
      this.fundRaise =analytics.fund_raise;
      this.maxFunding =analytics.max_funding;
      this.minFunding =analytics.min_funding;
      this.businessCountriesStats =analytics.countries
      return analytics
    }));

  }


  
  entities$ =this._statsService.getEntityStat().pipe(tap(res =>{
    this.entities =res;
  }))

  ngOnInit(): void {
    this.getAnalytics()
    this.stats$ =this._statsService.fetchUserStats().pipe(tap(res =>{
      this.matches =res;
      return res
    }))
  }

  filterStats(event: ChartEvent, q:string){
    const { data: {label}} =event;
    this.heading =label;
    this.filterStats$ =this._statsService.filterStats(label, q).pipe(tap(res =>{
      this.stagesStats =res.stages;
      this.businessCountriesStats =res.countries;
      this.sectorStats ={...this.sectorStats, companies: res.sectors}
      this.fundingStats ={...this.fundingStats, companies: res.funding}
    }))
  }
  
  close(){
    this.getAnalytics()
  }
}