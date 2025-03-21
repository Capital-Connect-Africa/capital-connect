import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerProfileComponent } from "../../components/partner-profile/partner-profile.component";
import { PartnerLayoutComponent } from "../../components/layout/layout.component";

@Component({
  selector: 'client-details',
  standalone: true,
  imports: [PartnerProfileComponent, PartnerLayoutComponent],
  templateUrl: './partnerProfilePage.component.html',
  styleUrl: './partnerProfilePage.component.scss'
})
export class PartnerProfilePage {
  constructor(){}
  private _router = inject(Router);

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

}
