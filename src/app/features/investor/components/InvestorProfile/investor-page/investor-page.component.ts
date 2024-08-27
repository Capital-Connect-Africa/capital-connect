import { Component, inject, Input, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../../core/components/navbar/navbar.component";
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { AlertCardComponent } from '../../../../profile/components/alert-card/alert-card.component';
import { ProfileService } from '../../../../profile/services/profile.service';
import { RoutingService } from '../../../../../shared/business/services/routing.service';
import { tap } from 'rxjs';
import { SignalsService } from '../../../../../core/services/signals/signals.service';

@Component({
  standalone: true,
  selector: 'app-investor-page',
  templateUrl: './investor-page.component.html',
  styleUrls: ['./investor-page.component.scss'],
  imports: [NavbarComponent,
    MatIcon,
    NavbarComponent,  
    CommonModule,
    AlertComponent,
    AlertCardComponent

  ]
})
export class InvestorPageComponent implements OnInit {
  @Input() showBanner =false;
  private _profileService =inject(ProfileService);
  private _routingService =inject(RoutingService)

  constructor() { }

  ngOnInit() {
  }

  signalsService =inject(SignalsService);
  showDialog(){
    this.signalsService.showDialog.set(true)
  }

  userProfile$ =this._profileService.get().pipe(tap(res =>{
    return res;
  }))

}
