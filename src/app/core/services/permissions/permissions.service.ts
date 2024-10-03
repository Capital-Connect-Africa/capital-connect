import { USER_ROLES } from "../../../shared";
import { inject, Injectable } from "@angular/core";
import { AuthStateService } from "../../../features/auth/services/auth-state.service";

@Injectable({providedIn: 'root'})

export class PermissionsService{
    private _authStateService =inject(AuthStateService)

    canFetchActiveSubscription(){
        const role:USER_ROLES =this._authStateService.currentUserProfile().roles as USER_ROLES
        return role ==USER_ROLES.USER;
    }

    private _userIs(role: USER_ROLES): boolean{
        const roles =[USER_ROLES.ADMIN, USER_ROLES.ADVISOR, USER_ROLES.INVESTOR, USER_ROLES.USER];
        const result =roles.includes(role);
        return result
    }
}