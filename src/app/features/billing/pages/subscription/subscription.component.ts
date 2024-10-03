import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { MainComponent } from "../../../business/components/subscription/main/main.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SubscriptionComponent as Billing} from "../../components/subscription/subscription.component";
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [SidenavComponent, MainComponent, NavbarComponent, Billing],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  links =BusinessLinks
}
