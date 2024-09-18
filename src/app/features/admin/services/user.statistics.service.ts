import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from "rxjs";
import { Stats } from "../interfaces/stats.interface";
import { zip } from "../../../core/utils/zip";

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

    fetchCountryBusinessStats(){
        return this.read(`${BASE_URL}/countries`).pipe(switchMap((countries: any[]) =>{
            const requests =countries.flat().map((country: {name: string}) =>this.read(`${BASE_URL}/statistics/businesses?country=${country.name}`))
            return forkJoin(requests).pipe(map(res =>{
                return zip(countries.map((country: {name: string}) =>({country: country.name})), res)
            })) as Observable<any>
        }),
        map((stats: [{ country: string }, { totalBusinesses: number }][]) =>{
            return stats.filter((items:[{country: string}, {totalBusinesses: number}]) =>items[1].totalBusinesses >0)
            .map((items:[{country: string}, {totalBusinesses: number}]) =>({country: items[0].country, totalBusinesses: items[1].totalBusinesses})) as {country: string, totalBusinesses: number}[]
        }),
        catchError(err =>{
            debugger
            return EMPTY
        }))
    }
}