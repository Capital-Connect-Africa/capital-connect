import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Rule } from '../../../../../shared/interfaces/rule.interface';
import { Voucher } from '../../../../../shared/interfaces/voucher.interface';

@Component({
  selector: 'app-voucher-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voucher-rules.component.html',
  styleUrl: './voucher-rules.component.scss'
})
export class VoucherRulesComponent {
  @Input() voucher!:Voucher;
  voucherRules:Rule[] =[];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher'] && this.voucher?.users) {
      this.voucherRules = this.voucher.rules;
    }
  }
}
