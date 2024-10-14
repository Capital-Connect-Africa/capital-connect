import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Plan } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class SubscriptionsService extends BaseHttpService{

    getSubscriptions(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/subscriptions?page=${page}&limit=${limit}`).pipe(map((subscriptions: any[]) =>{
            return subscriptions;
        })) as Observable<Plan[]>
    }

    getSubscription(planId:number){
        return this.readById(`${BASE_URL}/subscriptions`, planId).pipe(map((subscription: any) =>{
            debugger
          return subscription;
        })) as Observable<Plan>
    }

    deleteSubscription(planId: number){
        return this.delete(`${BASE_URL}/subscriptions`, planId).pipe(map(res =>{
            return res;
        }))
    }
}