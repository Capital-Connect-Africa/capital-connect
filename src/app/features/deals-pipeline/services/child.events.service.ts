import { Injectable } from '@angular/core';
import {  Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChildEventsService {
  private onDealSelected =new Subject<'Write'| 'Read'>();
  private onDealStageChange = new Subject<void>();
  private onPipelineModalOpened = new Subject<void>();

  dealSelected$ =this.onDealSelected.asObservable();
  dealStageChange$ = this.onDealStageChange.asObservable();
  pipelineModalOpened$ =this.onPipelineModalOpened.asObservable();


  emitDealStageChangeEvent() {
    this.onDealStageChange.next();
  }

  emitDealSelectedEvent(mode: 'Write' | 'Read' ='Read'){
    this.onDealSelected.next(mode);
  }

  emitPipelineModalOpenedEvent(){
    this.onPipelineModalOpened.next();
  }
}