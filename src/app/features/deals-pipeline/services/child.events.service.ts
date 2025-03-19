import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChildEventsService {
  private onDealStageChange = new Subject<void>();
  dealStageChange$ = this.onDealStageChange.asObservable();

  emitDealStageChangeEvent() {
    this.onDealStageChange.next();
  }
}