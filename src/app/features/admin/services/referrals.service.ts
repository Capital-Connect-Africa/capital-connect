import { inject, Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { firstValueFrom, map } from "rxjs";
import { ReferralTokenService } from "../../../shared/services/referral-token.service";
import { AuthStateService } from "../../auth/services/auth-state.service";

@Injectable({providedIn: 'root'})

export class ReferralsService extends BaseHttpService{
    private _authStateService =inject(AuthStateService);
    private _referralTokenService =inject(ReferralTokenService);

    getLeadersBoard(page:number, limit:number){
        return this.read(`${BASE_URL}/referrals?page=${page}&limit=${limit}`).pipe(map((referrals:any[]) =>{
            return referrals.map(referral =>{{
                
            }})
        }))
    }

    async updateMetrics(page:string, visits:boolean, clicks:boolean, referralId:string | null =null): Promise<any>{
        if(this._authStateService.isLoggedIn) return;
        if(referralId) this._referralTokenService.saveReferralToken(referralId);
        const referral =this._referralTokenService.getReferralToken();
        if(referral){
            const token =referral.token;
            const pages =referral.pages || []
            if(!token) return
            let visiting =visits && !pages.includes(page);
            if(visiting) {
                pages.push(page)
                referral.pages =pages;
                localStorage.setItem('referral', JSON.stringify(referral));
            }
            if(clicks || visiting) {
                return await firstValueFrom(this.update(`${BASE_URL}/referrals/metrics`, token, {visits: visiting, clicks}));
            }
        }
    }

}