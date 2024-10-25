import { Observable, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InvestorScreensService } from '../../../services/investor.screens.service';
import { AlertComponent } from "../../../../../shared/components/alert/alert.component";
import { NavbarComponent } from "../../../../../core/components/navbar/navbar.component";
import { ContactPerson, InvestorProfile } from '../../../../../shared/interfaces/Investor';
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";

@Component({
  selector: 'app-contact-persons',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TableModule, AdvertisementSpaceComponent, AlertComponent],
  templateUrl: './contact-persons.component.html',
  styleUrl: './contact-persons.component.scss'
})

export class ContactPersonsComponent {
  access$ =new Observable<any>();
  contactPersons:ContactPerson[] =[];
  investorProfile: InvestorProfile | null = null;
  private _screenService = inject(InvestorScreensService);

  cols =[
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'primaryContact', header: 'Primary Contact' },
    { field: 'action', header: 'Action' },
  ]


  investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
    this.investorProfile = investorProfile;
    this.contactPersons =investorProfile.contactPersons;
  }))

  grantAccess(contactPersonId:number){
    const investorProfileId =this.investorProfile?.id
    this.access$ =this._screenService.grantAccess(investorProfileId, contactPersonId)
  }
}