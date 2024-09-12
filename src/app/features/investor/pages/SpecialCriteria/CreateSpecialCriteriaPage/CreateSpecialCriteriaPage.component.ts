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
    {label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public'},
    { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },


    // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  ]

}
