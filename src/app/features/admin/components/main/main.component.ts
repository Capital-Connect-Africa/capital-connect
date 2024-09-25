import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { Observable, tap } from 'rxjs';
import { SharedStats, Stats } from '../../interfaces/stats.interface';
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { BubbleChartComponent } from "../../../../shared/components/charts/bubble-chart/bubble-chart.component";
import { BarChartComponent } from "../../../../shared/components/charts/bar-chart/bar-chart.component";
import { GeoChartComponent } from "../../../../shared/components/charts/geo-chart/geo-chart.component";
import { TableModule } from 'primeng/table';
import { User } from '../../../users/models';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { UserRoleFormatPipe } from '../../../../core/pipes/user-role-format.pipe';
import { HorizontalBarchartComponent } from "../../../../shared/components/charts/horizontal-barchart/horizontal-barchart.component";
import { ColumnChartComponent } from "../../../../shared/components/charts/column-chart/column-chart.component";


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
    ColumnChartComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  private _router = inject(Router);
  private _userServices =inject(UsersHttpService);
  private _statsService =inject(UserStatisticsService);
  sectorStats!:SharedStats;
  fundingStats!:SharedStats;
  minFunding!:Record<string, number>;
  maxFunding!:Record<string, number>;
  fundRaise!:Record<string, number>;
  stagesStats!:Record<string, number>;

  
  businessCountriesStats!:Record<string, number>;
  matches!:Stats;

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  stats$ =new Observable<Stats>();
  countryStats$ =new Observable();
  countriesStats:{country: string, value: number}[] =[];
  users: User[] = [];
  cols: any[] = [
    { field: 'firstName', header: 'Name' },
    { field: 'username', header: 'Email' },
    { field: 'roles', header: 'Type' },
  ];
  entities:any;

  analytics$ =this._statsService.getAnalytics().pipe(tap(analytics =>{
    this.stagesStats =analytics.stages;
    this.sectorStats =analytics.sectors;
    this.fundingStats =analytics.funding;
    this.fundRaise =analytics.fund_raise;
    this.maxFunding =analytics.max_funding;
    this.minFunding =analytics.min_funding;
    this.businessCountriesStats =analytics.countries;
    return analytics
  }));
  
  users$ =this._userServices.getAllUsers().pipe(tap(res =>{
    this.users =res.map(user =>{
      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }
    }).slice(0, 5)
  }))

  entities$ =this._statsService.getEntityStat().pipe(tap(res =>{
    this.entities =res;
  }))

  ngOnInit(): void {
    this.stats$ =this._statsService.fetchUserStats().pipe(tap(res =>{
      this.matches =res;
      return res
    }))
  }

}
