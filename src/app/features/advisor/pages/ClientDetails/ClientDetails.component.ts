import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {ClientDetails } from "../../components/client-details/client-details.component";

@Component({
  selector: 'client-details',
  standalone: true,
  imports: [ClientDetails],
  templateUrl: './ClientDetails.component.html',
  styleUrl: './ClientDetails.component.scss'
})
export class ClientDetailsComponent {
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
