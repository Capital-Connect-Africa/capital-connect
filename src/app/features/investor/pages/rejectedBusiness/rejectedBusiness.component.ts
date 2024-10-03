import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { RejectedBusinessComponent } from '../../components/rejectedBusiness/rejectedBusiness.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    RejectedBusinesComponent,
    RejectedBusinessComponent
  ],
  templateUrl: './rejectedBusiness.component.html',
  styleUrl: './rejectedBusiness.component.scss'
})
export class RejectedBusinesComponent {
  links = INVESTOR_DASHBOARD_LINKS
}
