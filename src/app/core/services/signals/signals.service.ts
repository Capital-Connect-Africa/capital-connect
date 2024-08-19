import { Injectable, signal, WritableSignal } from '@angular/core';
import { ActionBody, UserMobileNumbersIssues } from '../../../features/auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  showDialog: WritableSignal<boolean> =signal(false);
  showInAppAlert: WritableSignal<boolean> =signal(false);
  actionOnMobileNumbers: WritableSignal<boolean> =signal(false);
  actionBody:WritableSignal<ActionBody> =signal({
    issue: UserMobileNumbersIssues.EMPTY,
    title: 'Action Required',
    message: 'Please add your mobile phone number',
    command: 'Add'
  })
  pageTitle: WritableSignal<string> =signal('Dashboard')

}
