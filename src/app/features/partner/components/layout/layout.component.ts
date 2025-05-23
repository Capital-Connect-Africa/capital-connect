import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../core';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link.interface';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { SidenavComponent } from '../../../../core/components/sidenav/sidenav.component';

@Component({
  selector: 'partner-layout',
  standalone: true,
  imports: [CommonModule, UiSharedComponent, NavbarComponent, SidenavComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class PartnerLayoutComponent implements OnInit {
  links: Link[] = [];

  signalService = inject(SignalsService);

  @Input() bg_gray: boolean = false;
  @Input() title = 'Dashboard';

  ngOnInit(): void {
    this.signalService.pageTitle.set(this.title);
    this.links = [
      {
        label: 'Dashboard',
        href: '/partner',
        exact: true,
        icon: 'grid_view',
        display: true,
      },
      {
        label: 'Businesses',
        href: '/partner/businesses',
        exact: false,
        icon: 'location_city',
        display: true,
      },
      {
        label: 'Investors',
        href: '/partner/investors',
        exact: false,
        icon: 'account_balance',
        display: true,
      },
      {
        label: 'Analytics',
        href: '/partner/analytics',
        exact: false,
        icon: 'query_stats',
        display: true,
      },
      {
        label: 'Special Criteria',
        href: '/partner/special-criteria',
        exact: false,
        icon: 'filter_alt',
        display: true,
      },
      {
        label: 'Profile',
        href: '/partner/profile',
        exact: false,
        icon: 'person',
        display: true,
      },
    ];
  }
}
