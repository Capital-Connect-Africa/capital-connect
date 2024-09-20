import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { Observable, tap } from 'rxjs';
import { Stats } from '../../interfaces/stats.interface';
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { BubbleChartComponent } from "../../../../shared/components/charts/bubble-chart/bubble-chart.component";
import { BarChartComponent } from "../../../../shared/components/charts/bar-chart/bar-chart.component";
import { GeoChartComponent } from "../../../../shared/components/charts/geo-chart/geo-chart.component";
import { TableModule } from 'primeng/table';
import { User } from '../../../users/models';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { UserRoleFormatPipe } from '../../../../core/pipes/user-role-format.pipe';


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
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _router = inject(Router);
  private _userServices =inject(UsersHttpService);
  private _statsService =inject(UserStatisticsService);
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
  users$ =this._userServices.getAllUsers().pipe(tap(res =>{
    this.users =res.map(user =>{
      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }
    }).slice(0, 5)
  }))
  ngOnInit(): void {
    this.countryStats$ =this._statsService.fetchCountryBusinessStats().pipe(tap(res =>{
      this.countriesStats =res.map((stat) =>({country: stat.country, value: stat.totalBusinesses}));
    }));
    this.stats$ =this._statsService.fetchUserStats().pipe(tap(res =>{
      this.matches =res;
      return res
    }))
  }

}
