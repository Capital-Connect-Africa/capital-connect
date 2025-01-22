import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class ReferralTokenService{
    getReferralToken(): string | null{
        const { exp, token } =JSON.parse(localStorage.getItem('referral') || '{}') as {exp: Date, token: string}
        if(token && exp){
            if(exp.getTime() >new Date().getTime()){
                return token;
            }else this.removeToken()
        }
        return null;
    }

    removeToken(){
        localStorage.removeItem('referral')
    }
}