import { map } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { PesapalService } from "../../../shared/services/pesapal.service";

@Injectable({providedIn: 'root'})

export class CallbackService{
    private _pesapalService =inject(PesapalService);

    completeOrder(orderTrackingId: string, orderMerchantReference: string, redirectUrl:string =''){
        return this._pesapalService.callback(orderTrackingId, orderMerchantReference).pipe(map(res =>{
            return res;
        }))
    }
}