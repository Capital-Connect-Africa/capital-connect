import { Component, inject } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {MainComponent} from "../../components/main/main.component";
import { BusinessLinks, BusinessLinkService } from '../../../../core/utils/business.links';

@Component({
  selector: 'booking-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MainComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  hidden =true;
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
  private  _bs = inject(BusinessLinkService)
  links =BusinessLinks;
  // links = this._bs.getBusinessLinks();

}
