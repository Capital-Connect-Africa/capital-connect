import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';
import { NavbarComponent, SidenavComponent } from '../../../../core';

@Component({
  selector: 'app-deals-layout',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, NavbarComponent],
  templateUrl: './deals-layout.component.html',
  styleUrl: './deals-layout.component.scss'
})
export class DealsLayoutComponent {
  links =INVESTOR_DASHBOARD_LINKS
}
