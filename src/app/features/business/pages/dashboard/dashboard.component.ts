import { Component } from '@angular/core';
import { MainComponent } from "../../components/dashboard/main/main.component";
import { SidenavComponent } from '../../../../core';
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'business-dashboard',
  standalone: true,
  imports: [SidenavComponent, MainComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  hidden =true;
  links =BusinessLinks
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
