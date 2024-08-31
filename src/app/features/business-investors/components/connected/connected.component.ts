import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { InvestorService } from '../../services/investor.service';
import { ActivatedRoute } from '@angular/router';
import { BusinessProfile } from '../../../../shared/interfaces';

@Component({
  selector: 'app-connected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connected.component.html',
  styleUrl: './connected.component.scss'
})
export class ConnectedComponent {
  private _investorService =inject(InvestorService);
  private _activateRoute = inject(ActivatedRoute);
  private _investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));
  connected:BusinessProfile[] =[]

  connected$ =this._investorService.getConnectedBusinesses(this._investorId).pipe(tap(res =>{
    this.connected =res;
  }))
}
