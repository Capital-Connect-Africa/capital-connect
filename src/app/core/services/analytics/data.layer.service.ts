import { inject, Injectable } from '@angular/core';
import { WindowReferenceService } from './window.reference.service';
import { ReferralsService } from '../../../features/admin/services/referrals.service';

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
  private _windowService =inject(WindowReferenceService);
  private _window =this._windowService.nativeWindow;
  private _referralService =inject(ReferralsService);

  private _hitPage(obj: any): void {
    if (this._window && this._window.dataLayer) {
      this._window.dataLayer.push(obj);
    }
  }

  async logPageView(url: string): Promise<void>{
    const hit = {
      event: 'content-view',
      pageName: url
    };
    await this._referralService.updateMetrics(url, true, false);
    this._hitPage(hit);
  }

  logEvent(event: string, category: string, action: string, label: string): void {
    const hit = {
      event: event,
      category: category,
      action: action,
      label: label
    };
    this._hitPage(hit);
  }

  logPageDims(value: string): void {
    const hit = {
      event: 'window size',
      value: value
    };
    this._hitPage(hit);
  }
}
