import { inject, Injectable } from '@angular/core';
import { BASE_URL, BaseHttpService } from '../../../core';
import { AuthStateService } from '../../auth/services/auth-state.service';
import { map, Observable } from 'rxjs';
import { DealPipeline } from '../interfaces/deal.pipeline.interface';

@Injectable({
  providedIn: 'root'
})
export class DealsPipelineService extends BaseHttpService{

  BASE_LINK =`${BASE_URL}/deal-pipelines`

  private _authStateService =inject(AuthStateService);

  userId:number =this._authStateService.currentUserId();

  getUserPipelines(): Observable<DealPipeline[]>{
    return this.readById(`${this.BASE_LINK}/owner`, this.userId).pipe(map(res =>{
      return res as DealPipeline[]
    }))
  }
}
