import { Component, inject, Input } from '@angular/core';

import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../../../core";
import { OverviewComponent } from "../../../business/components/dashboard/overview/overview.component";
import { SchedulesSectionComponent } from "../../../../shared/components/schedules-section/schedules-section.component";

import { CommonModule } from "@angular/common";
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { ProfileService } from '../../services/profile.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    OverviewComponent,
    SchedulesSectionComponent,
    CommonModule,
    AlertComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
@Input() showBanner =false;
  private _profileService =inject(ProfileService);
  userProfile$ =this._profileService.get().pipe(tap(res =>{
    return res;
  }))
  signalsService =inject(SignalsService);
  showDialog(){
    this.signalsService.showDialog.set(true)
  }
}
