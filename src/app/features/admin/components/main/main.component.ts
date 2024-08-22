import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../admin-ui-container/admin-ui-container.component";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { Observable, tap } from 'rxjs';
import { Stats } from '../../interfaces/stats.interface';


@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule, ButtonModule,
    AdminUiContainerComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _router = inject(Router);
  private _statsService =inject(UserStatisticsService)

  matches!:Stats;

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  stats$ =new Observable<Stats>()
  ngOnInit(): void {

    this.stats$ =this._statsService.fetchUserStats().pipe(tap(res =>{
      this.matches =res
      return res
    }))
  }

}
