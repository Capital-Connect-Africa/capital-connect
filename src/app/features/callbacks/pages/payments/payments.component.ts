import { Observable, tap } from 'rxjs';
import { Router } from "@angular/router";
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../../../core';
import { CallbackService } from '../../services/callback.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})

export class PaymentsComponent {

  callback$ =new Observable();
  private _router =inject(Router);
  private _location =inject(Location);
  private _activatedRoute =inject(ActivatedRoute);
  private _callbackService =inject(CallbackService);
  private _feedbackService =inject(FeedbackService);
  private _params =this._activatedRoute.snapshot.queryParams;

  ngOnInit(): void {
    debugger
    const redirectUrl:string =this._params['RedirectUrl']
    const orderTrackingId:string =this._params['OrderTrackingId'];
    const orderMerchantReference:string =this._params['OrderMerchantReference'];
    this.callback$ =this._callbackService.completeOrder(orderTrackingId, orderMerchantReference).pipe(tap(res =>{
      this._feedbackService.success(res.message, 'Payments');
      if(redirectUrl) this._router.navigateByUrl(redirectUrl);
      else this._location.back();
    }))
  }

}
