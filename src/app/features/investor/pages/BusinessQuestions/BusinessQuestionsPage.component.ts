import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { SpecialCriteriaComponent } from '../../components/specialCriteria/specialCriteria.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';
import { BusinessQuestionsComponent } from "../../components/businessQuestions/businessQuestions.component";


@Component({
  selector: 'investor-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    SpecialCriteriaComponent,
    BusinessQuestionsComponent
],
  templateUrl: './BusinessQuestionsPage.component.html',
  styleUrl: './BusinessQuestionsPage.component.scss'
})
export class BusinessQuestionsPage {
  links = INVESTOR_DASHBOARD_LINKS
}
