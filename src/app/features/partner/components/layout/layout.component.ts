import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../core';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link.interface';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { SidenavComponent } from '../../../../core/components/sidenav/sidenav.component';
import { AuthStateService } from '../../../auth/services/auth-state.service';

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
    ];
  }
}
