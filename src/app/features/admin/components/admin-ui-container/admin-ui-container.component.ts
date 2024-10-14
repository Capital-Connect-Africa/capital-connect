import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { NavbarComponent } from '../../../../core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'app-admin-ui-container',
  standalone: true,
  imports: [CommonModule, UiSharedComponent, NavbarComponent, SidenavComponent],
  templateUrl: './admin-ui-container.component.html',
  styleUrls: ['./admin-ui-container.component.scss'] // Use styleUrls instead of styleUrl
})
export class AdminUiContainerComponent implements OnInit {
  isInvestor: boolean = false;
  links: Array<{ label: string; href: string; exact: boolean; icon: string }> = [];

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
    // Set the page title
    this.signalService.pageTitle.set(this.title);

    // Initialize links based on the isInvestor check
    this.links = !this.isInvestor
      ? [
          { label: 'Dashboard', href: '/dashboard', exact: false, icon: 'grid_view' },
          { label: 'Analytics', href: '/analytics', exact: false, icon: 'show_chart' },
          { label: 'Billing', href: '/billing', exact: false, icon: 'attach_money' },
          { label: 'Payments', href: '/payments', exact: false, icon: 'credit_card' },
          { label: 'Bookings', href: '/bookings', exact: false, icon: 'collections_bookmark' },
          { label: 'Subscriptions', href: '/subscriptions', exact: false, icon: 'hotel_class' },
          { label: 'Sections', href: '/questions', exact: false, icon: 'help' },
          { label: 'Companies', href: '/organization/list', exact: false, icon: 'apartment' },
          { label: 'Investors', href: '/business-investors', exact: false, icon: 'paid' },
          { label: 'Sectors', href: '/sectors', exact: false, icon: 'group_work' },
          { label: 'Users', href: '/users', exact: false, icon: 'supervised_user_circle' }
        ]
      : INVESTOR_DASHBOARD_LINKS;
  }
}
