import { Injectable, signal, WritableSignal } from '@angular/core';
import { ActionBody, UserMobileNumbersIssues } from '../../../features/auth/interfaces/auth.interface';
import { SectionSubmissions } from '../../../shared/interfaces/section.submissions.interface';

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
  businessInvestorPageSignal: WritableSignal<string> =signal('');
  matchedInvestorsDialogIsVisible: WritableSignal<boolean> =signal(false);
  connectionRequestsDialogIsVisible: WritableSignal<boolean> =signal(false);
  connectedInvestorsDialogIsVisible: WritableSignal<boolean> =signal(false);
  declinedConnectionsDialogIsVisible: WritableSignal<boolean> =signal(false);
  userSectionSubmissions: WritableSignal<SectionSubmissions | null> =signal(null);

}
