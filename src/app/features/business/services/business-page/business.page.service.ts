import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequestType } from '../../../../shared';

@Injectable({
  providedIn: 'root'
})
export class BusinessPageService {
  private currentPageSource = new BehaviorSubject<number>(1);
  private currentStepSource = new BehaviorSubject<number>(1);
  private currentAccessMode = new BehaviorSubject<RequestType>(RequestType.SAVE);
  current_page$ = this.currentPageSource.asObservable();
  current_step$ = this.currentStepSource.asObservable();
  current_mode$ = this.currentAccessMode.asObservable();

  setCurrentPage(page: number) {
    this.currentPageSource.next(page);
  }

  setCurrentStep(step: number) {
    this.currentStepSource.next(step);
  }
  setCurrentMode(mode: RequestType) {
    this.currentAccessMode.next(mode);
  }
}
