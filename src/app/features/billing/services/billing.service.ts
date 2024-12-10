import { catchError, EMPTY, map, Observable, switchMap, throwError } from "rxjs";
import { inject, Injectable } from "@angular/core";
import {BASE_URL, BaseHttpService } from "../../../core";
import { ActivePlan, Payment, PaymentPlan, SubscriptionResponse, SubscriptionTier, VoucherRedeemResponse } from "../../../shared/interfaces/Billing";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { SignalsService } from "../../../core/services/signals/signals.service";

@Injectable({providedIn: 'root'})

export class BillingService {
    private __http =inject(BaseHttpService);
    private _signalService =inject(SignalsService);
    private _authStateService =inject(AuthStateService);
    private _userId =this._authStateService.currentUserId();
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

    assignSubscriptionToUser(userId:number,subscriptionId:number){
        return this.__http.create(`${BASE_URL}/subscriptions/${userId}/${subscriptionId}`,{})
    }


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

    subscribe(tierId: number, upgrade:boolean =false, voucherCode:string =''){
        const url =upgrade? 'upgrade' : 'subscribe';
        const payload =voucherCode && voucherCode.length? {subscriptionTierId: tierId, voucherCode}: {subscriptionTierId: tierId}
        return this.__http.create(`${BASE_URL}/subscriptions/${url}`, payload).pipe(map((res: any) =>{
            return res;
        })) as Observable<SubscriptionResponse>
    }

    redeemVoucher(voucherCode:string){
        const purchase ='subscription-plan';
        const userId =this._authStateService.currentUserId();
        return this.__http.create(`${BASE_URL}/voucher/redeem-voucher`, {voucherCode, userId, purchase}).pipe(map((res: any) =>{
            return res as VoucherRedeemResponse;
        }))
    }

    getActivePlan(){
        const userId =this._authStateService.currentUserId();
        return this.__http.read(`${BASE_URL}/subscriptions/user/${userId}`).pipe(map((res: any) =>{
            return res;
        }),
        catchError(err =>{
        this._signalService.activePlan.set('basic')
        return EMPTY
    })) as Observable<ActivePlan>
    }

    getPaymentHistory(page:number, limit:number){
        return this.__http.read(`${BASE_URL}/payments/user/${this._userId}?page=${page}&limit=${limit}`).pipe(switchMap(payments => {
            return this.__http.read(`${BASE_URL}/statistics/payments/${this._userId}`).pipe(map((stats:any) =>{
                const total = [...Object.values(stats)].map(val =>Number(val)).reduce((acc:number, curr:number) =>acc +curr, 0)
                return {payments: payments as Payment[], total}
                
            }))
        }))
    }
    
    getRecentPayments(page:number =1, limit:number =5){
        return this.__http.read(`${BASE_URL}/payments/user/${this._userId}/recent?page=${page}&limit=${limit}`).pipe(map(res => {
            return res as PaymentPlan[]
        }))
    }
}