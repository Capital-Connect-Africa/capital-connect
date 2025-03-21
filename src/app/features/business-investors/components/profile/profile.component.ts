import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatchedInvestor } from '../../../../shared/interfaces';
import { InvestorService } from '../../services/investor.service';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private _activateRoute = inject(ActivatedRoute);
  investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));

  private _investorService =inject(InvestorService)
  investor$: Observable<MatchedInvestor> = this._investorService.getInvestorProfileIdByUserId(this.investorId).pipe(tap(res => {
    this.investor = res
  }))

  investor!: MatchedInvestor;

}
