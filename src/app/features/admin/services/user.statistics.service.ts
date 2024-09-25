import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from "rxjs";
import { SharedStats, Stats } from "../interfaces/stats.interface";
import { formatBand } from "../../../core/utils/band.formating";

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

    getBusinessCountriesStats(): Observable<Record<string, number>>{
        return this.read(`${BASE_URL}/statistics/businesses-country`).pipe(map((stats: any) =>{
            return stats
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getFundingStats():Observable<SharedStats> {
        return this.read(`${BASE_URL}/statistics/funding-stats`).pipe(map((res: any) =>{
            const payload:Record<string, {companies: number, investors: number}> =res;
            const companies: Record<string, number> ={};
            const investors: Record<string, number> ={};
            for (const [key, value] of Object.entries(payload)) {
                companies[key] = value.companies;
                investors[key] = value.investors;
            }
            return {companies, investors}
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getStagesStats():Observable<Record<string, number>> {
        return this.read(`${BASE_URL}/statistics/businesses-stage`).pipe(map((stats: any) =>{
            return stats
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getBusinessFundRaiseStats():Observable<{min: Record<string, number>, max: Record<string, number>}> {
        return this.read(`${BASE_URL}/statistics/businesses-fund`).pipe(map((stats: any) =>{
            const result:any ={}
            for(const [key, val] of Object.entries(stats)) result[formatBand(key)] =val;
            return Object.entries(result)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .reduce((obj: any, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getInvestorMinFundingStats():Observable<Record<string, number>> {
        return this.read(`${BASE_URL}/statistics/investors-funds?type=minimumFunding`).pipe(map((stats: any) =>{
            const result:any ={}
            for(const [key, val] of Object.entries(stats)) result[formatBand(key)] =val;
            return Object.entries(result)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .reduce((obj: any, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getInvestorMaxFundingStats(): Observable<Record<string, number>> {
        return this.read(`${BASE_URL}/statistics/investors-funds?type=maximumFunding`).pipe(map((stats: any) =>{
            const result:any ={}
            for(const [key, val] of Object.entries(stats)) result[formatBand(key)] =val;
            return Object.entries(result)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .reduce((obj: any, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});
        }), catchError(err =>{
            return EMPTY
        }))
    }

    getSectorStats():Observable<SharedStats> {
        return this.read(`${BASE_URL}/statistics/sectors-stats`).pipe(map((stats: any) =>{
            const payload:Record<string, {companies: number, investors: number}> =stats;
            const companies: Record<string, number> ={};
            const investors: Record<string, number> ={};
            for (const [key, value] of Object.entries(payload)) {
                companies[key] = value.companies;
                investors[key] = value.investors;
            }
            return {companies, investors}
        }), catchError(err =>{
            return EMPTY
        }))
    }

    countBusinessProfiles(){
        return this.read(`${BASE_URL}/statistics/businesses`).pipe(map(res =>{
          return res;
        }));
      }
    
      countInvestorProfiles(){
        return this.read(`${BASE_URL}/statistics/investors`).pipe(map(res =>{
          return res;
        }));
      }
    
      getEntityStat(){
       const requests =[this.countBusinessProfiles(), this.countInvestorProfiles()];
       return forkJoin(requests).pipe(map(res =>{
        return {...res[0], ...res[1]}
       }))

    }

    getAnalytics(){
        const requests =[this.getSectorStats(), this.getFundingStats(), this.getBusinessCountriesStats(), this.getStagesStats(), this.getInvestorMinFundingStats(), this.getInvestorMaxFundingStats(), this.getBusinessFundRaiseStats()]
        return forkJoin(requests).pipe(map(stats =>{
            return {
                sectors: stats[0] as SharedStats,
                funding: stats[1] as SharedStats,
                countries: stats[2] as Record<string, number>,
                stages: stats[3] as Record<string, number>,
                min_funding: stats[4] as Record<string, number>,
                max_funding: stats[5] as Record<string, number>,
                fund_raise: stats[6] as Record<string, number>
            }
        }))
    }

   
}