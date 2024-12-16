import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainComponent } from "../../components/main/main.component";

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [MainComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(){}
  private _router = inject(Router);


  links = [
    { label: 'Sections', href: '/questions', exact: true, icon: 'grid_view' },
    { label: 'Companies', href: '/business', exact: true, icon: 'store' },
    { label: 'Sectors', href: '/sectors', exact: false, icon: 'group_work' }
  ]



  navigateTo(path: string) {
    this._router.navigate([path]);
  }

}
