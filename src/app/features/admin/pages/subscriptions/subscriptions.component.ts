import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Payment, Plan } from '../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { SubscriptionsService } from '../../services/subscriptions.service';
import { ConfirmationService } from '../../../../core';
import { Router } from '@angular/router';
import { CheckExpiryPipe } from '../../../../core/pipes/check-expiry.pipe';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [AdminUiContainerComponent, CommonModule, TableModule, NumberAbbriviationPipe, TimeAgoPipe, CheckExpiryPipe, PaginatorModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent {
  first: number = 0;
  rows: number = 10;
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  filteredPlans: Plan[] = [];
  private _router =inject(Router);
  private _subscriptionsService =inject(SubscriptionsService);
  private _statsService =inject(UserStatisticsService);
  private _confirmationService =inject(ConfirmationService);
  plans: Plan[] =[];
  cols =[
    { field: 'subscriber', header: 'Subscriber' },
    { field: 'package', header: 'Package' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
    { field: 'date_subscribed', header: 'Purchased' },
    { field: 'action', header: 'Actions'}
  ];

  plans$ =new Observable<any>()

  getSubscriptions(page: number =1, limit:number =10){
    this.plans$ =this._subscriptionsService.getSubscriptions(page, limit).pipe(switchMap(plans =>{
      return this._statsService.getSubscriptionstats().pipe(tap(res =>{
        this.rowsCount =Object.values(res).reduce((acc:number, curr:number) => acc + curr, 0);
        this.plans =plans;
        this.updateDisplayedData();
      }))
    }))
  }

  ngAfterViewInit(): void {
    this.getSubscriptions();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getSubscriptions(this.currentPage , this.rows);
  }

  updateSubscriptionStatus(planId:number, isActive:boolean){
    this.delete$ =this._confirmationService.confirm(`Do you want to ${isActive? 'deactivate': 'activate'} plan?`).pipe(switchMap(confirmation =>{
      if(confirmation){
        return this._subscriptionsService.updateSubscriptionStatus(planId, !isActive).pipe(tap(_ =>{
          this.getSubscriptions(this.currentPage, this.rows);
        }))
      }
      return EMPTY;
    }))
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.plans;
    const start = this.table.first??0;
    const end = start + (this.table.rows??this.rows);
    this.showingRows = data.slice(start, end).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }

  openSubscription(planId:number){
    this._router.navigateByUrl(`/subscriptions/${planId}`)
  }
}
