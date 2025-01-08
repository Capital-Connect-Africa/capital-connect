import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Voucher } from '../../../../../shared/interfaces/voucher.interface';
import { BillingVoucherService } from '../../../services/billing-voucher.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";

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
