import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../../../components/admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../../services/user.statistics.service';
import { Observable, switchMap, tap } from 'rxjs';
import { SharedStats, Stats } from '../../../interfaces/stats.interface';
import { PieChartComponent } from "../../../../../shared/components/charts/pie-chart/pie-chart.component";
import { GeoChartComponent } from "../../../../../shared/components/charts/geo-chart/geo-chart.component";
import { TableModule } from 'primeng/table';
import { HorizontalBarchartComponent } from "../../../../../shared/components/charts/horizontal-barchart/horizontal-barchart.component";
import { ColumnChartComponent } from "../../../../../shared/components/charts/column-chart/column-chart.component";
import { Plan } from '../../../../../shared/interfaces/Billing';
import { ChartEvent } from '../../../../../shared/interfaces/chart.event.interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule, ButtonModule,
    AdminUiContainerComponent,
    PieChartComponent,
    GeoChartComponent,
    TableModule,
    HorizontalBarchartComponent,
    ColumnChartComponent
],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})

export class BusinessComponent {
  private _router = inject(Router);
  private _cdr =inject(ChangeDetectorRef);
  private _statsService =inject(UserStatisticsService);
  sectorStats!:SharedStats;
  fundingStats!:SharedStats;
  matchedBusinesses:number =0;
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
  stats$ =new Observable<any>();
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
    this.stats$ =this._statsService.fetchUserStats().pipe(switchMap(res =>{
      this.matches =res;
      return this._statsService.fetchBusinessAndInvestorInterractionsStats().pipe(tap(users =>{
        // the difference between users.total and (res.connected + res.declined + res.interesting + res.requested) = matched businesses
        this.matchedBusinesses =users.total - (res.connected + res.declined + res.interesting + res.requested)
      }))
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