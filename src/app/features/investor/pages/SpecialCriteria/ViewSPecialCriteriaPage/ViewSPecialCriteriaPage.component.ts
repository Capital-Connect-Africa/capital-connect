import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../../../../core';
import { ViewSpecialCriteriaComponent } from '../../../components/specialCriteria/ViewSpecialCriteria/ViewSpecialCriteria.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../../shared/routes/investor-dashboard-routes';

@Component({
  standalone: true,
  selector: 'app-ViewSPecialCriteriaPage',
  templateUrl: './ViewSPecialCriteriaPage.component.html',
  styleUrls: ['./ViewSPecialCriteriaPage.component.scss'],
  imports: [SidenavComponent, ViewSpecialCriteriaComponent]
})
export class ViewSPecialCriteriaPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  links = INVESTOR_DASHBOARD_LINKS
}
