import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class ReferralTokenService {

    getReferralToken(){
        const { exp, token, pages } =JSON.parse(localStorage.getItem('referral') || '{}') as {exp: Date, token: string, pages: string[]}
        if(token && exp){
            if(new Date(exp).getTime() >new Date().getTime()){
                return { token, pages}
            }else this.removeToken()
        }
        return null;
    }

    removeToken(){
        localStorage.removeItem('referral')
    }

    saveReferralToken(referralId:string | null){
        if(!referralId) return;
        const now =new Date();
        const then =new Date();
        then.setDate(now.getDate() +90);
        const referral =JSON.parse(localStorage.getItem('referral') as string)
        if(!referral){
            localStorage.setItem('referral', JSON.stringify({
                token: referralId,
                exp: then,
                pages: []
            }))
        }
    }
}