import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { WelcomeUserPipe } from '../../../../core/pipes/welcome-user.pipe';
import { CommonModule } from '@angular/common';
import { ReferralLinkComponent } from '../../../../shared/components/referral-link/referral-link.component';
import { TableModule } from 'primeng/table';
import { UserRoleFormatPipe } from '../../../../core/pipes/user-role-format.pipe';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { switchMap, tap } from 'rxjs';
import { User } from '../../../users/models';
import { BillingVoucherService } from '../../../admin/services/billing-voucher.service';
import { Voucher } from '../../../../shared/interfaces/voucher.interface';
import { UserStatisticsService } from '../../../admin/services/user.statistics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PartnerLayoutComponent,
    WelcomeUserPipe,
    ReferralLinkComponent,
    TableModule,
    UserRoleFormatPipe,
    TimeAgoPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private _usersService = inject(UsersHttpService);
  private _authStateService = inject(AuthStateService);
  private _vouchersService = inject(BillingVoucherService);
  private _userStatsService = inject(UserStatisticsService);
  users: User[] = [];
  total_count = 0;
  stats: {  name: string,  count: number, icon: string,  }[] =[]; 

  firstName = this._authStateService.currentUserProfile().firstName;
  userId =this._authStateService.currentUserId();
  users$ = this._usersService.getUserReferrees().pipe(
    tap((users) => {
      this.users = users.data;
    })
  );

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'username', header: 'Email' },
    { field: 'roles', header: 'Type' },
    { field: 'createdAt', header: 'Joined' },
  ];

  voucherCols = [
    { field: 'code', header: 'Code' },
    { field: 'discount', header: 'Discount' },
    { field: 'maxUses', header: 'Max Uses' },
    { field: 'maxAmount', header: 'Max Amount' },
    { field: 'uses', header: 'Uses' },
    { field: 'createdAt', header: 'Created' },
    { field: 'expiresAt', header: 'Expires' },
  ];

  vouchers$ = this._vouchersService
    .getVoucherUserVouchers(this.userId)
    .pipe(
      switchMap((vouchers) => {
        return this._userStatsService.getUserStats(this.userId).pipe(tap(stats =>{
          this.vouchers = vouchers.data;
          this.total_count = vouchers.total_count;
          this.stats =[
            {
              name: 'Investors',
              count: stats.investors ?? 0,
              icon: 'pi pi-briefcase',
            },
            {
              name: 'Businesses',
              count: stats.business??0,
              icon: 'pi pi-building',
            },
            {
              name: 'Advisors',
              count: stats.advisors??0,
              icon: 'pi pi-ethereum',
            },
            {
              name: 'Vouchers',
              count: vouchers.total_count,
              icon: 'pi pi-tag',
            }
          ]
        }))
      })
    );

  vouchers: Voucher[] = [];
}
