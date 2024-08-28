import { Component, OnInit } from '@angular/core';
import { CreateSpecialCriteriaComponent } from '../../../components/specialCriteria/CreateSpecialCriteria/CreateSpecialCriteria.component';
import { SidenavComponent } from '../../../../../core';

@Component({
  standalone:true,
  selector: 'app-CreateSpecialCriteriaPage',
  templateUrl: './CreateSpecialCriteriaPage.component.html',
  styleUrls: ['./CreateSpecialCriteriaPage.component.scss'],
  imports:[SidenavComponent, CreateSpecialCriteriaComponent]
})
export class CreateSpecialCriteriaPageComponent implements OnInit {

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
