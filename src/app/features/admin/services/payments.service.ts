import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Payment } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class PaymentsService extends BaseHttpService{

    getPayments(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/payments?page=${page}&limit=${limit}`).pipe(map((payments: any) =>{
          return {data: payments.data, total: payments.total}
        })) as Observable<{data: Payment[], total: number}>
    }

    getPayment(paymentId: number){
        return this.readById(`${BASE_URL}/payments`, paymentId).pipe(map((payment: any) =>{
            return payment
        })) as Observable<Payment>
    }

    deletePayment(paymentId: number){
        return this.delete(`${BASE_URL}/payments`, paymentId).pipe(map(res =>{
            return res
        }))
    }
}