import { inject, Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { firstValueFrom, map, Observable } from "rxjs";
import { ReferralTokenService } from "../../../shared/services/referral-token.service";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { ReferralLeader } from "../interfaces/referral.leader.interface";
import { ReferralStats } from "../interfaces/referral.stats.interface";

@Injectable({providedIn: 'root'})

export class ReferralsService extends BaseHttpService{
    private _authStateService =inject(AuthStateService);
    private _referralTokenService =inject(ReferralTokenService);

    getLeadersBoard(page:number, limit:number): Observable<ReferralLeader[]>{
        return this.read(`${BASE_URL}/referrals?page=${page}&limit=${limit}`).pipe(map((referrals:any[]) =>{
            return referrals.map(referral =>({
                name: `${referral.user.firstName} ${referral.user.lastName}`.trim(),
                clicks: referral.clicks,
                visits: referral.visits,
                signups: referral.user.referredUsers.length,
                rate: referral.user.referredUsers.length/referral.clicks *100
            })).sort((a, b) =>b.signups - a.signups || b.rate - a.rate || b.clicks - a.clicks).map((referral, index) =>({rank: index+1, ...referral}))
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
                localStorage.setItem('referral', JSON.stringify({...referral, pages}));
            }
            if(clicks || visiting) {
                return await firstValueFrom(this.update(`${BASE_URL}/referrals/metrics`, token, {visits: visiting, clicks}));
            }
        }
    }

    getStats(): Observable<ReferralStats>{
        return this.read(`${BASE_URL}/referrals/stats`).pipe(map((res:any) =>{
            const rate =(res.signups /res.clicks)*100;
            return {...res, rate}
        }))
    }

}