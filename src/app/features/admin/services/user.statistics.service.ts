import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from "rxjs";
import { SharedStats, Stats } from "../interfaces/stats.interface";
import { formatBand } from "../../../core/utils/band.formating";
import { Booking, Payment, Plan } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class UserStatisticsService extends BaseHttpService{

    getUserStats(userId:number | null =null){
        const url =`${BASE_URL}/statistics/users${userId?'/'+userId: ''}`
        return this.read(url).pipe(map((users:any) =>{
            return {
                staff: users.admin,
                business: users.user,
                advisors: users.advisor,
                investors: users.investor,
                contact_person: users.contact_person,
                partner: users.partner,
            } as Partial<Stats>
        }))
        
    }
    

    fetchUserStats(){
        const requests =[this.read(`${BASE_URL}/statistics/users`), this.read(`${BASE_URL}/statistics/matchmaking`)]
        return forkJoin(requests).pipe(map((res:any) =>{
            debugger
            const users =res[0];
            const matches =res[1];
            return {
                staff: users.staff,
                admin: users.admin,
                business: users.user,
                advisors: users.advisor,
                investors: users.investor,
                contact_person: users.contact_person,
                partner: users.partner,
                declined: matches.declined,
                requested: matches.requested,
                connected: matches.connected,
                interesting: matches.interesting,
            }
            
        })) as Observable<Stats>
    }

    fetchUserStatsByReferrer(referrerId: number){
        this.readById(`${BASE_URL}/statistics/referrer`, referrerId).pipe(map((res:any) =>{
            return res as {businesses: number, investors: number, advisors: number, }
        }))
    }

    fetchBusinessAndInvestorInterractionsStats(){;
        return this.read(`${BASE_URL}/matchmaking/counts`).pipe(map((res:any) =>{
            return res as {total: number}
        }))
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
                fund_raise: stats[6] as Record<string, number>,
                
            }
        }))
    }

    getSubscriptionstats(){
        return this.read(`${BASE_URL}/statistics/subscription`).pipe(map((subscriptions: any) =>{
          return subscriptions;
        })) as Observable<{basic: number, pro: number, elite: number, plus: number, subscriptions: number}>
    }


    getPaymentStats(){
        return this.read(`${BASE_URL}/statistics/payments`).pipe(map((res: any) =>{
            return res
        })) as Observable<{initiated: number, completed: number, failed: number,}>
    }
    getBookingStats(){
        return this.read(`${BASE_URL}/statistics/bookings`).pipe(map((res: any) =>{
            return res.bookings;
        })) as Observable<number>
    }

    getBookings(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/bookings?page=${page}&count=${limit}`).pipe(map((bookings: any[]) =>{
          return bookings.map((booking: any) =>{
            const payment =booking.payments.reduce((curr: Payment, acc:Payment) =>{
                return {
                    id: curr.id || acc.id,
                    createdAt: curr.createdAt || acc.createdAt,
                    currency: curr.currency || acc.currency,
                    amount: curr.amount + acc.amount,
                    description: curr.description || acc.description,
                    status: curr.status.length && acc.status.length? curr.status === acc.status? acc.status: 'partial': (curr.status || acc.status) || 'initited'
                }
            }, {id: null, amount: 0, currency: '', status: '', createdAt: '', description: ''});
            return {
                ...booking,
                payment: payment
            }
          })
        })) as Observable<Booking[]>
    }

    getSummary(){
        const requests =[this.getSubscriptionstats(),]
        return forkJoin(requests).pipe(map(res =>{
            return {
                subscription_counts: res[0] as Record<string, number>,
            }
        }))
    }

    filterStats(country:string, key:string){
        return this.create(`${BASE_URL}/statistics/stats-filter`, {[key]:[country]}).pipe(map((res:any) =>{
            return {
                sectors: res.Sectors as Record<string, number>,
                stages: res.Stage as Record<string, number>,
                countries: res.Countries as Record<string, number>,
                funding: res.useOfFunds as Record<string, number>,
            }
        }))
    }
}