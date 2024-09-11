import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessAndInvestorMatchingService } from '../../../../shared/business/services/busines.and.investor.matching.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-requests.component.html',
  styleUrl: './connection-requests.component.scss'
})
export class ConnectionRequestsComponent {
  private _router =inject(Router);
  private _activatedRoute =inject(ActivatedRoute);
  private _params =this._activatedRoute.snapshot.params;
  private _bimService =inject(BusinessAndInvestorMatchingService);
  uuid =this._params['uuid'];
  action =this._params['action'];
  done =false
  message ='';
  response$ =this._bimService.respondToInvestorConnectionRequest(this.uuid, this.action).pipe(tap(res =>{
    this.done =true;
    this.message ='Opearation was successful'
    this.goHome();
  }),
  catchError(err =>{
    this.message =err?.message;
    return EMPTY
  }))

  goHome(){
    this._router.navigateByUrl('/business')
  }
}
