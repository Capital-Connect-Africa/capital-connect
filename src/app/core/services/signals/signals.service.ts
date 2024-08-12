import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  showInAppAlert: WritableSignal<boolean> =signal(false);
  showDialog: WritableSignal<boolean> =signal(false);
}
