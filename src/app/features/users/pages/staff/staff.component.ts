import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, ViewChild, inject } from '@angular/core';
import { EMPTY, lastValueFrom, Observable, switchMap, tap } from 'rxjs';
import { TableModule, TablePageEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { AdminUiContainerComponent } from '../../../admin/components/admin-ui-container/admin-ui-container.component';
import { Role, User } from '../../models';
import { UsersHttpService } from '../../services/users-http.service';
import { ConfirmationService, FeedbackService } from '../../../../core';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { USER_ROLES } from '../../../../shared';

@Component({
  selector: 'staff-users',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule, FormsModule, ButtonModule, InputTextModule, TooltipModule, TimeAgoPipe],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffUsersComponent {
  private _usersService = inject(UsersHttpService);
  private _confirmationService = inject(ConfirmationService);

  updateUser$ =new Observable();
  users$ = new Observable<any>();
  delete$ = new Observable();
  usersCount:number =0;
  usersShowingCount =0;
  start =0;
  end =0;

  users: User[] = [];
  cols: any[] = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'username', header: 'Email' },
    { field: 'isEmailVerified', header: 'Email Verified' },
    { field: 'createdAt', header: 'Joined' },
    { field: 'actions', header: 'Actions' }
  ];

  @ViewChild('dt') table!: Table;

  ngAfterViewInit(): void {
    this._initUsers();
  }

  private _initUsers() {
    this.users$ = this._usersService.getUserByRole(USER_ROLES.STAFF).pipe(
      tap(users => {
        this.users = users.data;
        this.usersCount =users.total_count;
        this.usersShowingCount =this.table.value.length;
        this.updateDisplayedData();
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue, 'contains');
    this.usersCount = this.table.filteredValue ? this.table.filteredValue.length : this.users.length;
    this.updateDisplayedData();
  }

  deleteUser(user: User) {
    this.delete$ =
      this._confirmationService.confirm(`Are you sure you want to delete ${user.username}`).pipe(switchMap(res => {
        if (res) return this._usersService.deletUser(user.id)

        return EMPTY

      }), tap(() => this._initUsers()));
  }

  onPage(event: TablePageEvent){
    this.updateDisplayedData()
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.users;
    const start = this.table.first??10;
    const end = Math.min(start + (this.table.rows ?? 10), data.length);
    this.usersShowingCount = start + 1;
    this.end = end;
  }

  toggleUserActiveStatus(user:User){
    
    this.updateUser$ =this._confirmationService.confirm(`Do you want to ${user.isActive?'deactivate': 'activate'} ${user.firstName??''} ${user.lastName??''}? This user will ${user.isActive?'not be': 'be'} able to login.`).pipe(switchMap((res) =>{
      if(res)
        return this._usersService.updateUserByAdmin({isActive: !user.isActive}, user.id).pipe(tap(() =>{
          this._initUsers();
        }))
      return EMPTY;
    }))
  }
}
