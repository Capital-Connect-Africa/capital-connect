import { Component, inject } from '@angular/core';
import { BusinessProfile } from '../../../../shared/interfaces';
import { ActivatedRoute } from '@angular/router';
import { InvestorService } from '../../services/investor.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interested',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interested.component.html',
  styleUrl: './interested.component.scss'
})
export class InterestedComponent {
  private _activateRoute = inject(ActivatedRoute);
  private _investorService =inject(InvestorService);
  private _investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));
  interested:BusinessProfile[] =[]

  interested$ =this._investorService.getInterestingBusinesses(this._investorId).pipe(tap(res =>{
    this.interested =res;
  }))
}
