import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})

export class ReferralsService extends BaseHttpService{

    getLeadersBoard(page:number, limit:number){
        return this.read(`${BASE_URL}/referrals?page=${page}&limit=${limit}`).pipe(map((referrals:any) =>{
            debugger
        }))
    }

    clickReferralLink(){
        return 
    }

    visitReferralLink(){
        return 
    }

}