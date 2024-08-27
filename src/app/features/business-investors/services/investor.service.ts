import { inject, Injectable } from "@angular/core";
import { BusinessAndInvestorMatchingService } from "../../../shared/business/services/busines.and.investor.matching.service";
import { SignalsService } from "../../../core/services/signals/signals.service";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})

export class InvestorService{
    private _bIService =inject(BusinessAndInvestorMatchingService);
    private _signalsService =inject(SignalsService);
    getInvestorProfile(investorId: number){
        return this._bIService.getInvestorProfile(investorId).pipe(map(res =>{
            this._signalsService.businessInvestorPageSignal.set(res.organizationName);
            return res;
        }))
    }
}