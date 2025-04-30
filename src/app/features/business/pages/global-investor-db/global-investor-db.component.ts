import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessLinks } from '../../../../core/utils/business.links';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";

@Component({
  selector: 'app-global-investor-db',
  standalone: true,
  imports: [SidenavComponent, NavbarComponent, CommonModule, NumberAbbriviationPipe],
  templateUrl: './global-investor-db.component.html',
  styleUrl: './global-investor-db.component.scss'
})
export class GlobalInvestorDbComponent {
  links =BusinessLinks;
  investor: Partial<PublicInvestor> ={}
  private _activatedRoute =inject(ActivatedRoute);

  private _investorId =Number(this._activatedRoute.snapshot.params['id'])
  
  private _publicInvestorRepositoryService =inject(PublicInvestorsRepositoryService)
  investorDetails$ =this._publicInvestorRepositoryService.getInvestor(this._investorId).pipe(tap(res =>{
    this.investor =res
  }))
}
