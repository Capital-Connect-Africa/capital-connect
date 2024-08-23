import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { forkJoin, map, Observable } from "rxjs";
import { Stats } from "../interfaces/stats.interface";

@Injectable({providedIn: 'root'})

export class UserStatisticsService extends BaseHttpService{

    fetchUserStats(){
        const requests =[this.read(`${BASE_URL}/statistics/users`), this.read(`${BASE_URL}/statistics/matchmaking`)]
        return forkJoin(requests).pipe(map((res:any) =>{
            const users =res[0];
            const matches =res[1];
            return {
                    staff: users.admin,
                    business: users.user,
                    advisors: users.advisor,
                    investors: users.investor,
                    declined: matches.declined,
                    connected: matches.connected,
                    interesting: matches.declined,
                }
            
        })) as Observable<Stats>
    }
}