import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { ReferralsService } from '../../services/referrals.service';
import { ReferralLinkComponent } from "../../../../shared/components/referral-link/referral-link.component";
import { ReferralLeader } from '../../interfaces/referral.leader.interface';
import { ReferralStats } from '../../interfaces/referral.stats.interface';

@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [AdminUiContainerComponent, PieChartComponent, CommonModule, TableModule, ReferralLinkComponent],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss'
})
export class ReferalsComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _referralsService =inject(ReferralsService);
  cols =[
    {header: 'RNK', field: 'rank'},
    {header: 'User', field: 'name'},
    {header: 'Clicks', field: 'clicks'},
    {header: 'Visits', field: 'visits'},
    {header: 'Signups', field: 'signups'},
    {header: 'Rate', field: 'rate'},
  ]
  referrals:ReferralLeader[] =[]
  stats:ReferralStats ={
    clicks: 0,
    signups: 0,
    visits: 0,
    rate: 0
  }
  referrals$ =new Observable();
  stats$ =new Observable();

  ngOnInit(){
    this.getLeadersBoard();
    this.getStats()
  }

  getLeadersBoard(page =1, limit =10){
    this.referrals$ =this._referralsService.getLeadersBoard(page, limit).pipe(tap(referrals =>{
      this.referrals =referrals
    }))
  }

  getStats(){
    this.stats$ =this._referralsService.getStats().pipe(tap(stats =>{
      this.stats =stats;
    }))
  }
  
}
