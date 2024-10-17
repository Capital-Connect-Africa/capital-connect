import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Payment, Plan } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class SubscriptionsService extends BaseHttpService{

    getSubscriptions(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/subscriptions?page=${page}&limit=${limit}`).pipe(map((subscriptions: any[]) =>{
            return subscriptions;
        })) as Observable<Plan[]>
    }

    getSubscription(planId:number){
        return this.readById(`${BASE_URL}/subscriptions`, planId).pipe(map((subscription: any) =>{
            const payment =subscription.payments.reduce((curr: Payment, acc:Payment) =>{
                return {
                    id: curr.id || acc.id,
                    createdAt: curr.createdAt || acc.createdAt,
                    currency: curr.currency || acc.currency,
                    amount: curr.amount + acc.amount,
                    description: acc.description || curr.description,
                    status: curr.status.length && acc.status.length? curr.status === acc.status? acc.status: 'partial': (acc.status || curr.status) || 'initited'
                }
            }, {id: null, amount: 0, currency: '', status: '', createdAt: '', description: ''});
          return {...subscription, payment};
        })) as Observable<Plan>
    }

    deleteSubscription(planId: number){
        return this.delete(`${BASE_URL}/subscriptions`, planId).pipe(map(res =>{
            return res;
        }))
    }

    updateSubscriptionStatus(planId: number, isActive:boolean){
        return this.create(`${BASE_URL}/subscriptions/status/`, {id: planId, isActive}).pipe(map(res =>{
            return res;
        }))
    }
}