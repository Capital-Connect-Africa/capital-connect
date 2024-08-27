import { inject, Injectable } from "@angular/core";
import { BusinessAndInvestorMatchingService } from "../../../shared/business/services/busines.and.investor.matching.service";

@Injectable({providedIn: 'root'})

export class InvestorService{
    private _bIService =inject(BusinessAndInvestorMatchingService);
    getInvestorProfile(investorId: number){
        return this._bIService.getInvestorProfile(investorId)
    }
}