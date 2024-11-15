import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainComponent } from "../../components/main/main.component";
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [MainComponent],
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
