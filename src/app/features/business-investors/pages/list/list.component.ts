import { Component, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";
import { CommonModule } from '@angular/common';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { Role, User } from '../../../users/models';
import { EMPTY, lastValueFrom, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { ConfirmationService, FeedbackService } from '../../../../core';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { MatchedInvestor } from '../../../../shared/interfaces';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private _usersService = inject(UsersHttpService);

  investors$ = new Observable<MatchedInvestor[]>();
  usersCount:number =0;
  usersShowingCount =0;


  investors: MatchedInvestor[] = [];
  cols: any[] = [
    { field: 'organizationName', header: 'Name' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'headOfficeLocation', header: 'Country' },
    { field: 'matched', header: 'Matched' },
    { field: 'interested', header: 'Interested' },
    { field: 'connected', header: 'Connected' },
    { field: 'declined', header: 'Declined' },
  ];

  @ViewChild('dt') table!: Table;

  ngAfterViewInit(): void {
    this._init();
  }

  private _init() {
    this.investors$ = this._usersService.getAllInvestors().pipe(
      tap(investors=> {
        this.investors =investors;
        this.usersCount =investors.length;
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
    const end = start + (this.table.rows??10);
    this.usersShowingCount = data.slice(start, end).length;
  }
}
