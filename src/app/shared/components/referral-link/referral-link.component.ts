import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { AppQrCodeComponent } from '../app-qr-code/app-qr-code.component';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { ModalComponent } from "../modal/modal.component";
import { User } from '../../../features/users/models';
import { ReferralsService } from '../../../features/admin/services/referrals.service';
import { Observable, tap } from 'rxjs';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-referral-link',
  standalone: true,
  imports: [CommonModule, AppQrCodeComponent, ModalComponent,TableModule],
  templateUrl: './referral-link.component.html',
  styleUrl: './referral-link.component.scss',
})
export class ReferralLinkComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _authStateService = inject(AuthStateService);
  link = `https://app.capitalconnect.africa/auth/signup?r=${
    this._authStateService.currentUserProfile().referralCode
  }`;

  //booleans
  showRefferUsers:boolean = false

  //services
  private _rS = inject(ReferralsService)

  //vars
  refferedusers!:User[]
  refferedusers$  = new Observable<User[]>

  @Input() titleText ='Referral Link'
  @Input() helperText ='Share this referral link to invite users'



  showReferees(){
    this.refferedusers$ = this._rS.getMyReferees(this._authStateService.currentUserProfile().id).pipe(tap(res=>{
      this.refferedusers = res
      this.showRefferUsers = true
    }))
  }

  linkCopied = false;
  async copyToClipboard(): Promise<void> {
    const range = document.createRange();
    const selection = window.getSelection();

    if (this.textDiv.nativeElement && selection) {
      range.selectNodeContents(this.textDiv.nativeElement);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        await navigator.clipboard.writeText(this.link);
        this.linkCopied = true;
        setTimeout(() => {
          this.linkCopied = false;
          selection.removeAllRanges();
        }, 5000);
      } catch (error) {
        this.linkCopied = false;
      }
    }
  }
}
