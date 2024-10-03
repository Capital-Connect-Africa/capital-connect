import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../core";
import { map, Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class PesapalService extends BaseHttpService{

    callback(OrderTrackingId:string, OrderMerchantReference:string, OrderNotificationType="success"){
        return this.create(`${BASE_URL}/payments/callback`, {
            OrderMerchantReference, 
            OrderTrackingId,
            OrderNotificationType
        }).pipe(map((res: any) =>res)) as Observable<{message: string}>
    }
}
