import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { UsersHttpService } from '../../../users/services/users-http.service';
import { tap } from 'rxjs';
import { Role, User } from '../../../users/models';
import { Router } from '@angular/router';

@Component({
  selector: 'partner-businesses',
  standalone: true,
  imports: [PartnerLayoutComponent, TableModule, CommonModule, TimeAgoPipe],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.scss'
})
export class BusinessesComponent {
  total_count =0
  users:User[] = [];
  private _router =inject(Router)
  private _usersService =inject(UsersHttpService)
  users$ =this._usersService.getUserReferrees(Role.USER, 1, 100).pipe(tap(users =>{
    this.users =users.data;
    this.total_count =users.count;
  }))

  cols = [
    { field: 'name', header: 'User' },
    { field: 'phone', header: 'Phone' },
    { field: 'email', header: 'Email' },
    { field: 'createdAt', header: 'Joined' },
    // { field: 'action', header: 'Action' },
  ];

  
  viewBusinessDetails(businessId: number){
    this._router.navigateByUrl(`/partner/businesses/${businessId}`)
  }
}
