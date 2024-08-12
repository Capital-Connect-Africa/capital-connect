import { Component } from '@angular/core';
import {
    AdvertisementSpaceComponent
} from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import {
    AssessmentSummaryComponent
} from "../../../../../shared/components/assessment-summary/assessment-summary.component";
import {MatIcon} from "@angular/material/icon";
import {NavbarComponent} from "../../../../../core";
import {OverviewComponent} from "../../dashboard/overview/overview.component";
import {
    SchedulesSectionComponent
} from "../../../../../shared/components/schedules-section/schedules-section.component";
import {TaskActionComponent} from "../../../../../shared/components/task-action/task-action.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    AdvertisementSpaceComponent,
    AssessmentSummaryComponent,
    MatIcon,
    NavbarComponent,
    OverviewComponent,
    SchedulesSectionComponent,
    TaskActionComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  task_one =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
  ]
  task_two =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
  ]
  task_three =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
  ]
  task_four =[
    {name: 'Get Expert Document Prep', action:'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
  ]
}
