import { map, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { SignalsService } from "../../../core/services/signals/signals.service";
import { BusinessAndInvestorMatchingService } from "../../../shared/business/services/busines.and.investor.matching.service";
import { UsersHttpService } from "../../users/services/users-http.service";
import { BusinessProfile } from "../../../shared/interfaces";

@Injectable({providedIn: 'root'})

export class InvestorService{
    private _signalsService =inject(SignalsService);
    private _bIService =inject(BusinessAndInvestorMatchingService);
    private _userService =inject(UsersHttpService);

    getInvestorProfile(investorId: number){
        return this._bIService.getInvestorProfile(investorId).pipe(map(res =>{
            this._signalsService.businessInvestorPageSignal.set(res.organizationName);
            return res;
        }))
    }

    getInvestorProfileIdByUserId(investorId: number){
        return this._bIService.getInvestorProfileIdByUserId(investorId).pipe(map(res =>{
            return res;
        }))
    }

    getConnectedBusinesses(investorId:number){
        return this._userService.getInvestorConnectedBusinesses(investorId).pipe(map(res =>{
            return res;
        })) as Observable<BusinessProfile[]>
    }

    getInterestingBusinesses(investorId:number){
        return this._userService.getInvestorInterestedBusinesses(investorId).pipe(map(res =>{
            return res;
        })) as Observable<BusinessProfile[]>
    }

    getCancelledBusinesses(investorId:number){
        return this._userService.getInvestorDeclinedBusinesses(investorId).pipe(map(res =>{
            return res.map(business =>({...business, declineReasons: business.declineReasons || []}));
        })) as Observable<BusinessProfile[]>
    }

    getMatchedBusinesses(investorId:number){
        return this._userService.getInvestorMatchedBusinesses(investorId).pipe(map(res =>{
            return res.map(business =>({company: {...business}}));
        })) as Observable<BusinessProfile[]>
    }
}