import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";
import { Voucher } from '../../../../../shared/interfaces/voucher.interface';

@Component({
  selector: 'app-voucher-details',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './voucher-details.component.html',
  styleUrl: './voucher-details.component.scss'
})
export class VoucherDetailsComponent {

  @Input() voucher!:Voucher;
}
