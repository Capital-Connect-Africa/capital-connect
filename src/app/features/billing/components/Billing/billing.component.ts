import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatchedInvestor } from '../../../../shared/interfaces';

import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class ProfileComponent {

  private _activateRoute = inject(ActivatedRoute);
  investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));

  investor!: MatchedInvestor;

}
