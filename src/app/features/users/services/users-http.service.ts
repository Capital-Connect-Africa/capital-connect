import { Injectable } from '@angular/core';
import { BASE_URL, BaseHttpService } from '../../../core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({providedIn: 'root'})
export class UsersHttpService extends BaseHttpService {
  constructor(private httpClient: HttpClient) { 
    super(httpClient);
  }

  getAllUsers(){
    return this.read(`${BASE_URL}/users`) as Observable<User[]>;
  }

  getUserById(id:number){
    return this.readById(`${BASE_URL}/users`, id) as Observable<User>
  }

  getuserProfile(){
    return this.read(`${BASE_URL}/users/profile`) as Observable<any>;
  }

  updateUser(user: Partial<User>) {
    return this.update(`${BASE_URL}/users`, (user.id  as number), user) as Observable<User>;
  }

  updateUserByAdmin(user: User) {
    return this.httpClient.put(`${BASE_URL}/users/${user.id}/admin`, JSON.stringify(user))
  }

  deletUser(id:number) {
    return this.delete(`${BASE_URL}/users`,id);
  }

}