import { catchError, EMPTY, map, Observable, throwError } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {BASE_URL, BaseHttpService } from "../../../core";
import { SubscriptionResponse, SubscriptionTier } from "../../../shared/interfaces/Billing";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { SignalsService } from "../../../core/services/signals/signals.service";

@Injectable({providedIn: 'root'})

export class BillingService {
    private __http =inject(BaseHttpService);
    private _signalService =inject(SignalsService);
    private _authStateService =inject(AuthStateService);

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

    // assignSubscriptionToUser(userId:number,subscriptionId:number){
    //     return this.create(`${BASE_URL}/subscriptions/${userId}/${subscriptionId}`)
    // }


    //Update a subscription tier
    updateSubscriptionTier(subscriptionTier:SubscriptionTier,id:number){
        return this.__http.updatePatch(`${BASE_URL}/subscription-tiers`,id,subscriptionTier).pipe(
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
        }),
    catchError(err =>{
        this._signalService.activePlan.set('basic')
        return EMPTY
    })) as Observable<SubscriptionTier>
    }
}