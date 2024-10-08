import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from "rxjs";
import { SharedStats, Stats } from "../interfaces/stats.interface";
import { formatBand } from "../../../core/utils/band.formating";
import { Booking, Payment, Plan } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class PaymentsService extends BaseHttpService{

    getPayments(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/payments?page=${page}&limit=${limit}`).pipe(map((payments: any[]) =>{
          return payments
        })) as Observable<Payment[]>
    }

    deletePayment(paymentId: number){
        return this.delete(`${BASE_URL}/payments`, paymentId).pipe(map(res =>{
            return res
        }))
    }
}