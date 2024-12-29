import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../../users/models';
import { CommonModule } from '@angular/common';
import { Voucher, VoucherUser } from '../../../../../shared/interfaces/voucher.interface';
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-voucher-user',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './voucher-user.component.html',
  styleUrl: './voucher-user.component.scss'
})
export class VoucherUserComponent {
  @Input() voucher!:Voucher;
  voucherUsers:VoucherUser[] =[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher'] && this.voucher?.users) {
      this.voucherUsers = this.voucher.users;
    }
  }

}
