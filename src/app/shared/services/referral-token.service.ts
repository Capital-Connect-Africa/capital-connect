import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class ReferralTokenService {

    getReferralToken(){
        const { token, pages } =JSON.parse(localStorage.getItem('referral') || '{}') as {token: string, pages: string[]}
        if(token){
            return { token, pages}
        }
        return null;
    }

    removeToken(){
        localStorage.removeItem('referral')
    }

    saveReferralToken(referralId:string | null){
        if(!referralId) return;
        const referral =JSON.parse(localStorage.getItem('referral') as string)
        if(!referral){
            localStorage.setItem('referral', JSON.stringify({
                token: referralId,
                pages: []
            }))
        }
    }
}