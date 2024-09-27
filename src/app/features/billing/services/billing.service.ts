import { catchError, EMPTY, map, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {BASE_URL, BaseHttpService } from "../../../core";
import { SubscriptionResponse, SubscriptionTier } from "../../../shared/interfaces/Billing";
import { AuthStateService } from "../../auth/services/auth-state.service";

@Injectable({providedIn: 'root'})

export class BillingService {
    private _authStateService =inject(AuthStateService);
    private __http =inject(BaseHttpService);

    //Create  a subscription tier
    createSubscriptionTier(subscriptionTier:SubscriptionTier){
        return this.__http.create(`${BASE_URL}/subscription-tiers`,subscriptionTier).pipe(
            map((res=>{}))
        )
    }

    //Get all Subscription Tiers
    getSubscriptionTiers():Observable<SubscriptionTier[]> {
        return this.__http.read(`${BASE_URL}/subscription-tiers`).pipe(map((res:any) => {
            const tiers:SubscriptionTier[] =res
            return tiers.sort((a:SubscriptionTier, b: SubscriptionTier) =>a.price - b.price)
        })) as Observable<SubscriptionTier[]>
    }

    //Get a single subscription tier
    getSubscriptionTier(id:number):Observable<SubscriptionTier> {
        return this.__http.read(`${BASE_URL}/subscription-tiers`).pipe(map(
            res => res as unknown as SubscriptionTier
        ))
    }


    //Update a subscription tier
    updateSubscriptionTier(subscriptionTier:SubscriptionTier,id:number){
        return this.__http.update(`${BASE_URL}/subscription-tiers`,id,subscriptionTier).pipe(
            map((res=>{}))
        )
    }
    
    //Delete a subscription tier
    deleteTier(id:number){
        return this.__http.delete(`${BASE_URL}/subscription-tiers`,id).pipe(
            map((res=>{}))
        )
    }

    subscribe(tierId: number){
        return this.__http.create(`${BASE_URL}/subscriptions/subscribe`, {subscriptionTierId: tierId}).pipe(map((res: any) =>{
            return res;
        })) as Observable<SubscriptionResponse>
    }

    getActivePlan(){
        const userId =this._authStateService.currentUserId()
        return this.__http.read(`${BASE_URL}/subscriptions/${userId}`).pipe(map((res: any) =>{
            return res;
        })) as Observable<SubscriptionTier>
    }
}