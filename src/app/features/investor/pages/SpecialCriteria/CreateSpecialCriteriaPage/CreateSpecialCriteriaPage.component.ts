import { Component, OnInit } from '@angular/core';
import { CreateSpecialCriteriaComponent } from '../../../components/specialCriteria/CreateSpecialCriteria/CreateSpecialCriteria.component';
import { SidenavComponent } from '../../../../../core';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../../shared/routes/investor-dashboard-routes';

@Component({
  standalone:true,
  selector: 'app-CreateSpecialCriteriaPage',
  templateUrl: './CreateSpecialCriteriaPage.component.html',
  styleUrls: ['./CreateSpecialCriteriaPage.component.scss'],
  imports:[SidenavComponent, CreateSpecialCriteriaComponent]
})
export class CreateSpecialCriteriaPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  links = INVESTOR_DASHBOARD_LINKS

}
