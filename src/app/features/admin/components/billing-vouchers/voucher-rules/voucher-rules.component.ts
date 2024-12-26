import { Component, Input, SimpleChanges } from '@angular/core';
import { Voucher, VoucherRule, VoucherUser } from '../../../../../shared/interfaces/voucher.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voucher-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voucher-rules.component.html',
  styleUrl: './voucher-rules.component.scss'
})
export class VoucherRulesComponent {
  @Input() voucher!:Voucher;
  voucherRules:VoucherRule[] =[];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher'] && this.voucher?.users) {
      this.voucherRules = this.voucher.rules;
    }
  }
}
