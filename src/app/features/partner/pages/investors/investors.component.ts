import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { Router } from '@angular/router';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { tap } from 'rxjs';
import { Role, User } from '../../../users/models';

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [PartnerLayoutComponent, TableModule, CommonModule, TimeAgoPipe],
  templateUrl: './investors.component.html',
  styleUrl: './investors.component.scss'
})
export class InvestorsComponent {
  total_count =0
    users:User[] = [];
    private _router =inject(Router)
    private _usersService =inject(UsersHttpService)
    users$ =this._usersService.getUserReferrees(Role.INVESTOR, 1, 100).pipe(tap(users =>{
      debugger
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
  
    
    viewInvestorDetails(investorId: number){
      this._router.navigateByUrl(`/partner/investors/${investorId}`)
    }
}
