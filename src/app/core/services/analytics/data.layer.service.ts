import { inject, Injectable } from '@angular/core';
import { WindowReferenceService } from './window.reference.service';

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
  private _windowService =inject(WindowReferenceService);
  private _window =this._windowService.nativeWindow;

  private _hitPage(obj: any): void {
    if (this._window && this._window.dataLayer) {
      this._window.dataLayer.push(obj);
    }
  }

  logPageView(url: string): void {
    const hit = {
      event: 'content-view',
      pageName: url
    };
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
