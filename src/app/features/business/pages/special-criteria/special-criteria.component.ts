import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Criteria } from '../../interfaces/special-criteria.interface';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';
import { Router } from '@angular/router';

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
    {label: 'Plans', href: '/business/plans', exact: false, icon: 'paid'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'Special Criteria', href: '/business/special-criteria', exact: false, icon: 'contact_support'},
    // {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},
  ];

  criteriaList:Criteria[] =[];
  private _router =inject(Router);
  private _specialCriteriaService =inject(SpecialCriteriaService);
  specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteria().pipe(tap(res =>{
    this.criteriaList =res;
  }))
  
  openQuestions(criteriId: number){
    this._router.navigateByUrl(`/business/special-criteria/${criteriId}`);
  }

}