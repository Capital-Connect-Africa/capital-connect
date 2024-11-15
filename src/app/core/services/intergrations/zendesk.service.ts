// src/app/services/zendesk.service.ts
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    zE: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  constructor() {}

  openChat() {
    if (window.zE) {
      window.zE('webWidget', 'open');
    }
  }

  closeChat() {
    if (window.zE) {
      window.zE('webWidget', 'close');
    }
  }

  setVisitorInfo(name: string, email: string) {
    if (window.zE) {
      window.zE('webWidget', 'identify', {
        name,
        email,
      });
    }
  }
}
