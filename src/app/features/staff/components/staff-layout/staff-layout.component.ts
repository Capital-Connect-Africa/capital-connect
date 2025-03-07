import { Component, inject, Input } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link.interface';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { UiSharedComponent } from "../../../../shared/components/ui/ui.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, NavbarComponent, UiSharedComponent, CommonModule],
  templateUrl: './staff-layout.component.html',
  styleUrl: './staff-layout.component.scss'
})
export class StaffLayoutComponent {
   links: Link[] = [];
  
    signalService = inject(SignalsService);
  
    @Input() bg_gray: boolean = false;
    @Input() title = 'Dashboard';
  
    ngOnInit(): void {
      this.signalService.pageTitle.set(this.title);
      this.links = [
        {
          label: 'Dashboard',
          href: '/staff',
          exact: true,
          icon: 'grid_view',
          display: true,
        },
        {
          label: 'Profile',
          href: '/staff/profile',
          exact: true,
          icon: 'person',
          display: true,
        },
      ];
    }
}
