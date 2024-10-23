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
  links: Array<{ label: string; href: string; exact: boolean; icon: string ,display:boolean}> = [];

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
          { label: 'Dashboard', href: '/dashboard', exact: false, icon: 'grid_view' ,display:true},
          { label: 'Analytics', href: '/analytics', exact: false, icon: 'show_chart' ,display:true},
          { label: 'Billing', href: '/billing', exact: false, icon: 'attach_money',display:true },
          { label: 'Payments', href: '/payments', exact: false, icon: 'credit_card' ,display:true},
          { label: 'Bookings', href: '/bookings', exact: false, icon: 'collections_bookmark' ,display:true},
          { label: 'Subscriptions', href: '/subscriptions', exact: false, icon: 'hotel_class',display:true },
          { label: 'Sections', href: '/questions', exact: false, icon: 'help' ,display:true},
          { label: 'Companies', href: '/organization/list', exact: false, icon: 'apartment' ,display:true},
          { label: 'Investors', href: '/business-investors', exact: false, icon: 'paid' ,display:true},
          { label: 'Sectors', href: '/sectors', exact: false, icon: 'group_work' ,display:true},
          { label: 'Users', href: '/users', exact: false, icon: 'supervised_user_circle' ,display:true}
        ]
      : INVESTOR_DASHBOARD_LINKS;
  }
}
