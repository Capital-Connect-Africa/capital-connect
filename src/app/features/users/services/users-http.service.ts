import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  map, Observable, switchMap } from 'rxjs';
import { BASE_URL, BaseHttpService } from '../../../core';
import { User } from '../models';
import { MatchedInvestor } from '../../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UsersHttpService extends BaseHttpService {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getAllUsers() {
    return this.read(`${BASE_URL}/users`).pipe(map(users =>{
      return users;
    })) as Observable<User[]>;
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

  getUserReferrees(){
    return this.read(`${BASE_URL}/users/referrals`).pipe(map(users =>{
      return users;
    })) as Observable<User[]>;
  }

  getAllInvestorsProfiles(){
    return this.read(`${BASE_URL}/investor-profiles`).pipe(map(res =>{
      return res;
    })) as Observable<MatchedInvestor[]>
  }
  getInvestorStats(investorId: number){
    return this.read(`${BASE_URL}/statistics/matchmaking/${investorId}?role=investor`).pipe(map(res =>{
      return res
    })) as Observable<any[]>
  }
  getAllInvestors(page =1, limit =1000): Observable<{data: MatchedInvestor[], total_count: number}> {
    return this.read(`${BASE_URL}/users/role?usertype=investor&page=${page}&limit=${limit}`).pipe(map((res: any) =>{
      return res
    })) as Observable<{data: MatchedInvestor[], total_count: number}>;
  }

  getBusinessOwners(page =1, limit =1000): Observable<{data: User[], total_count: number}> {
    return this.read(`${BASE_URL}/users/role?usertype=user&page=${page}&limit=${limit}`).pipe(map((res:any) =>{
      return res
    })) as Observable<{data: User[], total_count: number}>;
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

  assignSubscriptionToUser(userid:number, subsscriptionId:number){
    return this.create(`${BASE_URL}/subscriptions/${userid}/${subsscriptionId}`,{}) as Observable<any>;
  }

}