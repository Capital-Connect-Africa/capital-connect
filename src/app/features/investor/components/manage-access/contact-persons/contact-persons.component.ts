import { Observable, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NameInitialsPipe } from '../../../../../core/pipes/name-initials.pipe';
import { InvestorScreensService } from '../../../services/investor.screens.service';
import { AlertComponent } from "../../../../../shared/components/alert/alert.component";
import { NavbarComponent } from "../../../../../core/components/navbar/navbar.component";
import { ContactPerson, InvestorProfile } from '../../../../../shared/interfaces/Investor';
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";

@Component({
  selector: 'app-contact-persons',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TableModule, AdvertisementSpaceComponent, AlertComponent, NameInitialsPipe],
  templateUrl: './contact-persons.component.html',
  styleUrl: './contact-persons.component.scss'
})

export class ContactPersonsComponent {
  access$ =new Observable<any>();
  revoke$ =new Observable<any>();
  contactPersons:ContactPerson[] =[];
  investorProfile: InvestorProfile | null = null;
  private _screenService = inject(InvestorScreensService);

  cols =[
    { field: 'profile', header: 'Profile' },
    { field: 'role', header: 'Role' },
    { field: 'action', header: 'Action' },
  ]
  investorProfile$ =new Observable();

  getContactPersons(){
    this.investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
      this.investorProfile = investorProfile;
      this.contactPersons =[{id: investorProfile.investor.id, emailAddress: investorProfile.investor.username, designation: 'super admin', firstName: investorProfile.investor.firstName, hasAccess: true, phoneNumber: '', primaryContact: true, lastName: investorProfile.investor.lastName}, ...investorProfile.contactPersons];
      this.contactPersons =this.contactPersons.map(contactPerson =>({...contactPerson, name: `${contactPerson.firstName} ${contactPerson.lastName}`.trim()}));
    }))
  }

  ngOnInit() {
    this.getContactPersons();
  }

  grantAccess(contactPersonId:number){
    const investorProfileId =this.investorProfile?.id
    this.access$ =this._screenService.grantAccess(investorProfileId, contactPersonId).pipe(tap(res =>{
      this.getContactPersons();
    }))
  }

  revokeAccess(contactPersonId:number){
    const investorProfileId =this.investorProfile?.id;
    this.revoke$ =this._screenService.revokeAccess(investorProfileId, contactPersonId).pipe(tap(res =>{
      this.getContactPersons();
    }))
  }

}