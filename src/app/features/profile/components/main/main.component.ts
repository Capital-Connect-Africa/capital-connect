import { Component, inject, Input } from '@angular/core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    OverviewComponent,
    SchedulesSectionComponent,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
@Input() showBanner =false;



}
