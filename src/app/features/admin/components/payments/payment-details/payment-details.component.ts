import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../../../services/payments.service';
import { Payment } from '../../../../../shared/interfaces/Billing';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from '../../../../../core/pipes/number-abbreviation.pipe';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, TimeAgoPipe],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss'
})
export class PaymentDetailsComponent {
  payment: Payment | null =null;
  private _activatedRoute =inject(ActivatedRoute);
  private _paymentService =inject(PaymentsService);

  paymentId =Number(this._activatedRoute.snapshot.params['id']);
  payment$ =this._paymentService.getPayment(this.paymentId).pipe(tap(payment =>{
    this.payment =payment
  }))
}
