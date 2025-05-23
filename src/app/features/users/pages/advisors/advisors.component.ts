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
import { AdvisorService } from '../../../advisor/services/advisor-profile.service';
import { AdvisorProfile } from '../../../../shared/interfaces/advisor.profile';

@Component({
  selector: 'app-business-owners',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule, FormsModule, ButtonModule, InputTextModule, TooltipModule],
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.scss']
})
export class AdvisorsAdminComponent {
  //services
  private _usersService = inject(UsersHttpService);
  private _router = inject(Router);
  private _confirmationService = inject(ConfirmationService);
  private _companyService = inject(CompanyHttpService);
  private _feedbackService = inject(FeedbackService);
  private _advisorService = inject(AdvisorService)

  //streams
  updateAdvisor$ =new Observable();
  users$ = new Observable<any>();
  delete$ = new Observable();
  
  //vars
  advisorProfiles: AdvisorProfile[] = [];
  usersCount:number =0;
  usersShowingCount =0;
  start =0;
  end =0;

  users: User[] = [];
  cols: any[] = [
    { field: 'fullName', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone Number' },
    { field: 'totalCapitalRaised', header: 'Total Capital Raised' },
    { field: 'totalYearsExperience', header: 'Total Years Of Experience' },
    { field: 'actions', header: 'Actions' }
  ];

  @ViewChild('dt') table!: Table;

  ngAfterViewInit(): void {
    this._initUsers();
  }

  private _initUsers() {
    this.users$ = this._advisorService.getAllAdvisorProfiles().pipe(
      tap(res => {
        this.advisorProfiles = res;
        // this.usersCount =users.total_count;
        // this.usersShowingCount =this.table.value.length;
        // this.updateDisplayedData();
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue, 'contains');
    this.usersCount = this.table.filteredValue ? this.table.filteredValue.length : this.users.length;
    this.updateDisplayedData();
  }

  editUser(user: User) {
    this._router.navigateByUrl(`/users/edit/${user.id}`);
  }

  deleteUser(user: User) {
    this.delete$ =
      this._confirmationService.confirm(`Are you sure you want to delete ${user.username}`).pipe(switchMap(res => {
        if (res) return this._usersService.deletUser(user.id)

        return EMPTY

      }), tap(() => this._initUsers()));
  }

  viewUser(user: User) {
    if(user.roles === Role.USER) {
      lastValueFrom(this._companyService.getCompanyOfUser(user.id).pipe(tap(company => {
        if (company) {
          this._router.navigateByUrl(`/organization/${company.id}`)
        } else {
          this._feedbackService.info(`User ${user.username} does not have a company`)
        }
      })))
    } else {
      this._feedbackService.info(`User ${user.username} does not have a company`)
    }
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

  toggleAdvisorActiveStatus(advisor:User){
    this.updateAdvisor$ =this._confirmationService.confirm(`Do you want to ${advisor.isActive?'deactivate': 'activate'} ${advisor.fullName??''}? This user will ${advisor.isActive?'not be': 'be'} able to login.`).pipe(switchMap((res) =>{
      if(res)
        return this._usersService.updateUserByAdmin({isActive: !advisor.isActive}, advisor.id).pipe(tap(() =>{
          this._initUsers();
        }))
      return EMPTY;
    }))
  }
}
