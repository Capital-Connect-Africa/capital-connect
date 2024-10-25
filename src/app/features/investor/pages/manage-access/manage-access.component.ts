import { Component } from '@angular/core';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';
import { SidenavComponent } from '../../../../core';
import { ContactPersonsComponent } from "../../components/manage-access/contact-persons/contact-persons.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { AlertComponent } from "../../../../shared/components/alert/alert.component";

@Component({
  selector: 'app-manage-access',
  standalone: true,
  imports: [SidenavComponent, ContactPersonsComponent, SchedulesSectionComponent, AdvertisementSpaceComponent, AlertComponent],
  templateUrl: './manage-access.component.html',
  styleUrl: './manage-access.component.scss'
})
export class ManageAccessComponent {
  links = INVESTOR_DASHBOARD_LINKS
}
