import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../../../../core';
import { ViewSpecialCriteriaComponent } from '../../../components/specialCriteria/ViewSpecialCriteria/ViewSpecialCriteria.component';

@Component({
  standalone: true,
  selector: 'app-ViewSPecialCriteriaPage',
  templateUrl: './ViewSPecialCriteriaPage.component.html',
  styleUrls: ['./ViewSPecialCriteriaPage.component.scss'],
  imports: [SidenavComponent, ViewSpecialCriteriaComponent]
})
export class ViewSPecialCriteriaPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  links =[
    {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
    {label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune'},
    {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'},

    // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  ]

}
