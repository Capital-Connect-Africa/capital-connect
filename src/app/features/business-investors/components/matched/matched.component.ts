import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { BusinessProfile } from '../../../../shared/interfaces';
import { InvestorService } from '../../services/investor.service';

@Component({
  selector: 'app-matched',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matched.component.html',
  styleUrl: './matched.component.scss'
})
export class MatchedComponent {
  private _activateRoute = inject(ActivatedRoute);
  private _investorService =inject(InvestorService);
  private _investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));
  matched:BusinessProfile[] =[]

  matched$ =this._investorService.getMatchedBusinesses(this._investorId).pipe(tap(res =>{
    this.matched =res;
  }))
}
