import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { map, of } from "rxjs";
import { Profile } from "../../../shared/interfaces/profile.interface";
import { Company } from "../../organization/interfaces";

@Injectable({ providedIn: 'root' })

export class ProfileService extends BaseHttpService{

    get(){
        const userProfile =JSON.parse(sessionStorage.getItem('userProfile')??JSON.stringify('{}'));
        const company:Company =JSON.parse(sessionStorage.getItem('currentCompany')??JSON.stringify('{}'));
        const profile:Profile ={
            name: `${userProfile?.firstName??''} ${userProfile?.lastName??''}`.trim(),
            email: userProfile?.username,
            mobileNumber: [...userProfile?.mobileNumbers].map(phone =>phone.phoneNo).join(', '),
            company: company
        }
        return of(profile)
    }
}