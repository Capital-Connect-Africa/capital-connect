import { Injectable } from "@angular/core";
import { USER_ROLES } from "../../../shared";

@Injectable({providedIn: 'root'})

export class PermissionsService{

    canFetchActiveSubscription(role: USER_ROLES){
        return this._userIs(role)
    }

    private _userIs(role: USER_ROLES): boolean{
        const roles =[USER_ROLES.ADMIN, USER_ROLES.ADVISOR, USER_ROLES.INVESTOR, USER_ROLES.USER];
        const result =roles.includes(role);
        return result
    }
}