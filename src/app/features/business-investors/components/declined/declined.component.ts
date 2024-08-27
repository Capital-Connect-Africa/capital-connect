import { Component, inject } from '@angular/core';
import { InvestorService } from '../../services/investor.service';
import { ActivatedRoute } from '@angular/router';
import { BusinessProfile } from '../../../../shared/interfaces';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declined',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './declined.component.html',
  styleUrl: './declined.component.scss'
})
export class DeclinedComponent {
  private _investorService =inject(InvestorService);
  private _activateRoute = inject(ActivatedRoute);
  private _investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));
  connected:BusinessProfile[] =[]

  connected$ =this._investorService.getCancelledBusinesses(this._investorId).pipe(tap(res =>{
    this.connected =res;
  }))
}
