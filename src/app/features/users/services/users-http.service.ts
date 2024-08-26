import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { BASE_URL, BaseHttpService } from '../../../core';
import { User } from '../models';
import { MatchedInvestor } from '../../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UsersHttpService extends BaseHttpService {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getAllUsers() {
    return this.read(`${BASE_URL}/users`) as Observable<User[]>;
  }

  getInvestorMatchedBusinesses(investorId: number){
    return this.read(`${BASE_URL}/matchmaking/companies/${investorId}`) as Observable<any[]>;
  }

  getInvestorConnectedBusinesses(investorId: number){
    return this.read(`${BASE_URL}/matchmaking/connected/${investorId}`) as Observable<any[]>;
  }

  getInvestorDeclinedBusinesses(investorId: number){
    return this.read(`${BASE_URL}/matchmaking/declined/${investorId}`) as Observable<any[]>;
  }

  getInvestorInterestedBusinesses(investorId: number){
    return this.read(`${BASE_URL}/matchmaking/interested/${investorId}`) as Observable<any[]>;
  }

  getAllInvestorsProfiles(){
    return this.read(`${BASE_URL}/investor-profiles`).pipe(map(res =>{
      return res;
    })) as Observable<MatchedInvestor[]>
  }

  getAllInvestors(): Observable<MatchedInvestor[]> {
    return this.read(`${BASE_URL}/investor-profiles`).pipe(
      switchMap((investors: MatchedInvestor[] | any[]) => {
        const investorRequests = investors.map((investor: MatchedInvestor) => {
          return forkJoin([
            this.getInvestorMatchedBusinesses(investor.id),
            this.getInvestorInterestedBusinesses(investor.id),
            this.getInvestorConnectedBusinesses(investor.id),
            this.getInvestorDeclinedBusinesses(investor.id),
          ]).pipe(
            map(res => ({
              ...investor,
              matched: res[0].length,
              interested: res[1].length,
              connected: res[2].length,
              declined: res[3].length
            }))
          );
        });
  
        return forkJoin(investorRequests);
      })
    ) as Observable<MatchedInvestor[]>;
  }
  

  getUserById(id: number) {
    return this.readById(`${BASE_URL}/users`, id) as Observable<User>
  }

  getuserProfile() {
    return this.read(`${BASE_URL}/users/profile`) as Observable<any>;
  }

  updateUser(user: Partial<User>) {
    return this.update(`${BASE_URL}/users`, (user.id as number), user) as Observable<User>;
  }

  updateUserByAdmin(user: Partial<User>, id: number) {
    const _headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(`${BASE_URL}/users/${id}/admin`, (user), { headers: _headers })
  }

  deletUser(id: number) {
    return this.delete(`${BASE_URL}/users`, id);
  }

}