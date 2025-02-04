import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { AppQrCodeComponent } from '../app-qr-code/app-qr-code.component';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';

@Component({
  selector: 'app-referral-link',
  standalone: true,
  imports: [CommonModule, AppQrCodeComponent],
  templateUrl: './referral-link.component.html',
  styleUrl: './referral-link.component.scss',
})
export class ReferralLinkComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _authStateService = inject(AuthStateService);
  link = `https://app.capitalconnect.africa/signup?r=${
    this._authStateService.currentUserProfile().referralCode
  }`;

  @Input() titleText ='Referral Link'
  @Input() helperText ='Share this referral link to invite users'

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
