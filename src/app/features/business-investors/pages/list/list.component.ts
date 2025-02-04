import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatchedInvestor } from '../../../../shared/interfaces';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule, TimeAgoPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private _usersService = inject(UsersHttpService);
  private _router =inject(Router)

  investors$ = new Observable<any>();
  usersCount:number =0;
  usersShowingCount =0;
  userShowingCountEnd =0;


  investors: MatchedInvestor[] = [];
  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'username', header: 'Email' },
    { field: 'isEmailVerified', header: 'Email Verified' },
    { field: 'createdAt', header: 'Joined' },
  ];

  @ViewChild('dt') table!: Table;

  ngAfterViewInit(): void {
    this._init();
  }

  private _init() {
    this.investors$ = this._usersService.getAllInvestors().pipe(
      tap(investors=> {
        this.investors =investors.data;
        this.usersCount =investors.total_count;
        this.usersShowingCount =this.table.value.length;
        this.updateDisplayedData();
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue, 'contains');
    this.usersCount = this.table.filteredValue ? this.table.filteredValue.length : this.investors.length;
    this.updateDisplayedData();
  }


  onPage(event: TablePageEvent){
    this.updateDisplayedData()
  }

  updateDisplayedData() {

    const data = this.table.filteredValue || this.investors;
    const start = this.table.first??10;
    const end = Math.min(start + (this.table.rows ?? 10), data.length);
    this.usersShowingCount = start + 1;
    this.userShowingCountEnd = end;
  }

  viewInvestor(investorId:number){
    let investor = sessionStorage.getItem('profileId')
    this._router.navigateByUrl(`/business-investors/${investorId}`)
  }
}
