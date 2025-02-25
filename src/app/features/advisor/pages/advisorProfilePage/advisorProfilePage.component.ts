import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {ClientDetails } from "../../components/client-details/client-details.component";
import { AdvisorProfileComponent } from "../../components/advisor-profile/advisor-profile.component";

@Component({
  selector: 'client-details',
  standalone: true,
  imports: [ClientDetails, AdvisorProfileComponent],
  templateUrl: './advisorProfilePage.component.html',
  styleUrl: './advisorProfilePage.component.scss'
})
export class AdvisorProfilePage {
  constructor(){}
  private _router = inject(Router);

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

}
