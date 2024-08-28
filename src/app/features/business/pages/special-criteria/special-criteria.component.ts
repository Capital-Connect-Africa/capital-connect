import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [CommonModule, SidenavComponent, NavbarComponent],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss'
})
export class SpecialCriteriaComponent {
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},
  ];

  private _specialCriteriaService =inject(SpecialCriteriaService);
  specialCriteriaQuestions$ =this._specialCriteriaService.getCompanySpecialCriteria().pipe(tap(res =>{
    debugger
  }))
}
