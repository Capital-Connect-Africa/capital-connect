import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../../users/models';
import { CommonModule } from '@angular/common';
import { Voucher } from '../../../../../shared/interfaces/voucher.interface';

@Component({
  selector: 'app-voucher-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voucher-user.component.html',
  styleUrl: './voucher-user.component.scss'
})
export class VoucherUserComponent {
  @Input() voucher!:Voucher;
  users:User[] =this.voucher.users;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher']) {
      this.users = this.voucher.users;
    }
  }

}
