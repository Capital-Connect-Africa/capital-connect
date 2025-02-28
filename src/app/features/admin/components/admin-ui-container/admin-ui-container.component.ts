import { CommonModule } from '@angular/common';
import { BASE_URL, NavbarComponent } from '../../../../core';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link.interface';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';
import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-admin-ui-container',
  standalone: true,
  imports: [CommonModule, UiSharedComponent, NavbarComponent, SidenavComponent],
  templateUrl: './admin-ui-container.component.html',
  styleUrls: ['./admin-ui-container.component.scss'] // Use styleUrls instead of styleUrl
})
export class AdminUiContainerComponent implements OnInit {
  isInvestor: boolean = false;
  links: Link[] = [];
  private _authStateService =inject(AuthStateService)

  constructor() {
    let investor = sessionStorage.getItem('profileId');
    if (investor) {
      this.isInvestor = true;
    }
  }

  signalService = inject(SignalsService);

  @Input() bg_gray: boolean = false;
  @Input({ required: true }) title = 'Dashboard';

  ngOnInit(): void {
    this.signalService.pageTitle.set(this.title);
    this.links = !this.isInvestor
      ? [
          { label: 'Dashboard', href: '/dashboard', exact: false, icon: 'grid_view' ,display:true },
          { label: 'Analytics', href: '/analytics', icon: 'equalizer', display:true, children: [
            { label: 'Business', href: '/analytics', icon: 'bar_chart', exact: true },
            { label: 'Investors', href: '/analytics/investors', icon: 'pie_chart' },
          ]},
          {label: 'Financials',  display: true, icon: 'account_balance_wallet', href: '/billing', children: [
              { label: 'Billing', href: '/billing', exact: false, icon: 'attach_money',display:true },
              { label: 'Payments', href: '/payments', exact: false, icon: 'credit_card' ,display:true},
              { label: 'Bookings', href: '/bookings', exact: false, icon: 'collections_bookmark' ,display:true},
              { label: 'Subscriptions', href: '/subscriptions', exact: false, icon: 'hotel_class',display:true },
              { label: 'Reports',href:'/financial-reports',exact: false,icon: 'attach_money',display:true}
            ]},
            {label: 'Promotions',  display: true, icon: 'local_fire_department', href: '/billing-vouchers', children: [
              { label: 'Vouchers', href: '/billing-vouchers', exact: false, icon: 'sell' ,display:true},
            ]},
            {label: 'Users', display: true, href: '/organization/list', icon: 'manage_accounts', children: [
              { label: 'Companies', href: '/organization/list', exact: false, icon: 'apartment' ,display:true},
              { label: 'Investors', href: '/business-investors', exact: false, icon: 'paid' ,display:true},
              { label: 'Biz Owners', href: '/business-owners', exact: false, icon: 'supervised_user_circle' ,display:true},
              { label: 'Advisors', href: '/admin/advisors', exact: false, icon: 'supervisor_account' ,display:true},

              // { label: 'Users', href: '/users', exact: false, icon: 'supervised_user_circle' ,display:true}
            ]},
            {label: 'Operations', display: true, href: '/referrals', icon: 'trending_up', children: [
              { label: 'Referrals', href: '/referrals', exact: false, icon: 'screen_share' ,display:true},
              { label: 'Investors DB', href: '/repository/investors', exact: false, icon: 'backup' ,display:true},
              { label: 'Sections', href: '/questions', exact: false, icon: 'help' ,display:true},
              { label: 'Sectors', href: '/sectors', exact: false, icon: 'group_work' ,display:true},
              { label: 'Task Manager', href: `${BASE_URL}/admin/queues?authorization=${this._authStateService.authToken}`, exact: false, icon: 'add_to_queue' ,display:true, external: true},
            ]},
            
        ]
      : INVESTOR_DASHBOARD_LINKS;
  }
}
