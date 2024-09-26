import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { UiComponent } from '../../../sectors/components/ui/ui.component';
import { MainComponent } from "../../components/main/main.component";
import { SidenavComponent } from '../../../../core';
import { SharedModule } from '../../../../shared';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, UiComponent, MainComponent, SidenavComponent, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isInvestor:boolean = false

  constructor(){
    let investor = sessionStorage.getItem('profileId')

    if(investor){
      this.isInvestor = true
    }
  }


  private _router = inject(Router);

  

  links = this.isInvestor ? INVESTOR_DASHBOARD_LINKS : [
    { label: 'Sections', href: '/questions', exact: true, icon: 'grid_view' },
    { label: 'Companies', href: '/business', exact: true, icon: 'store' },
    { label: 'Sectors', href: '/sectors', exact: false, icon: 'group_work' }
  ]



  navigateTo(path: string) {
    this._router.navigate([path]);
  }

}
