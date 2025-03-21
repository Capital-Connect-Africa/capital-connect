import { Injectable } from "@angular/core";
import { BASE_URL,BaseHttpService } from "../../core";
import { catchError, map, Observable} from "rxjs";
import { StaffProfile } from "../../shared/interfaces/partner";

@Injectable({providedIn: 'root'})
export class StaffService extends BaseHttpService{
    //Create Partner Profile
    createStaffProfile(payload: StaffProfile):Observable<unknown>{
        return this.create(`${BASE_URL}/staff-profile`, payload).pipe(map((res:any) =>{
            return res as unknown
        }))
    }

    // Get Partner profile by id
    getStaffProfileById(id: number) :Observable<StaffProfile>{
        return this.readById(`${BASE_URL}/staff-profile`, id).pipe(map((res: any) => {
            return res as StaffProfile;
        }));
    }

    //Get by User Id
    getStaffProfileByUserId(id: number):Observable<StaffProfile>{
        return this.readById(`${BASE_URL}/staff-profile/user`, id).pipe(
            map((res: any) => {
                return res as StaffProfile;
            }),
            catchError((error) => {
                console.error('Error fetching staff profile by user ID:', error);
                throw error;
            })
        );
    }

    //Get All Partner Profiles        
    getAllStaffProfiles(id: number){
        this.read(`${BASE_URL}/staff-profile`).pipe(map((res:any) =>{
            return res as StaffProfile[]
        }))
    }

    //  Update Partner Profile
    updateStaffProfile(id:number,payload: StaffProfile):Observable<unknown>{
        return this.putPost(`${BASE_URL}/staff-profile/${id}`, payload).pipe(map((res:any) =>{
            return res as unknown
        }))
    }


    //Get profile staff key expertise        
    getProfilesKeyExpertise():Observable<string[]>{
        return this.read(`${BASE_URL}/staff-profile/list/expertise`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }

    //Get profile staff key expertise        
    getProfilesServicesOffered():Observable<string[]>{
        return this.read(`${BASE_URL}/staff-profile/list/services-offered`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }


    //Get profile staff key expertise        
    getProfilesEngagementType():Observable<string[]>{
        return this.read(`${BASE_URL}/staff-profile/list/engagement-type`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }
}