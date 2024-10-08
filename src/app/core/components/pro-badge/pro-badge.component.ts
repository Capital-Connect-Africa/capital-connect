import { Component,inject } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { Observable ,Subscription} from 'rxjs';
import { PaymentService } from '../../../shared/services/payment.service';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { TransactionStatus } from '../../../shared/interfaces/payment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pro-badge',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './pro-badge.component.html',
  styleUrl: './pro-badge.component.scss'
})
export class ProBadgeComponent {
  visible:boolean = false;
  orderTrackingId: string = ''
  createBooking$ = new Observable<TransactionStatus | null>();
  transactionStatusSubscription$ = new Observable<unknown>();
  private _paymentService = inject(PaymentService)
  private _feedbackService = inject(FeedbackService)
  private _router = inject(Router)


  redirectUrl: SafeResourceUrl | null = null;
  booking : boolean = false;
  subscription!: Subscription;
  checkStatus: boolean = false
  message: { title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null = null;

  transactionStatus$ = new Observable<unknown>() ;

  message$ = new Observable<{ title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>;

  constructor(){} 

  ngOnInit() {
    this.message$ = this._feedbackService.message$;
  }

  checkPaymentStatus() {
    this.transactionStatus$ = this._paymentService.getTransactionStatus(this.orderTrackingId).pipe(
      tap((status: TransactionStatus) => {
        if (status.status === '200') {
          this.booking = true;
          this.checkStatus = false;
          this._feedbackService.success('Payment successful!', 'Payment Status');
        } else if (status.payment_status_description === 'pending') {
          this._feedbackService.warning('Payment pending.', 'Payment Status');
        } else {
          this._feedbackService.error('Payment failed.', 'Payment Status');
        }
      }),
      catchError((error: any) => {
        this._feedbackService.error('Error checking payment status.', 'Payment Status');
        return of(null);
      }),
    );
  }

  createBooking() {
    this._router.navigate(['/payment-instructions']);
  }

}
