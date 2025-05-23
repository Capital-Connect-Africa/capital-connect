import { Injectable } from "@angular/core";
import { BASE_URL,BaseHttpService } from "../../core";
import { catchError, map, Observable} from "rxjs";
import { PartnerProfile } from "../../shared/interfaces/partner";

@Injectable({providedIn: 'root'})
export class PartnerService extends BaseHttpService{
    //Create Partner Profile
    createPartnerProfile(payload: PartnerProfile):Observable<unknown>{
        return this.create(`${BASE_URL}/partner-profile`, payload).pipe(map((res:any) =>{
            return res as unknown
        }))
    }

    // Get Partner profile by id
    getPartnerProfileById(id: number) :Observable<PartnerProfile>{
        return this.readById(`${BASE_URL}/partner-profile`, id).pipe(map((res: any) => {
            return res as PartnerProfile;
        }));
    }

    //Get by User Id
    getPartnerProfileByUserId(id: number):Observable<PartnerProfile>{
        return this.readById(`${BASE_URL}/partner-profile/user`, id).pipe(
            map((res: any) => {
                return res as PartnerProfile;
            }),
            catchError((error) => {
                console.log('Error fetching partner profile by user ID:', error);
                throw error;
            })
        );
    }

    //Get All Partner Profiles        
    getAllPartnerProfiles(id: number){
        this.read(`${BASE_URL}/partner-profile`).pipe(map((res:any) =>{
            return res as PartnerProfile[]
        }))
    }

    //  Update Partner Profile
    updatePartnerProfile(id:number,payload: PartnerProfile):Observable<unknown>{
        return this.putPost(`${BASE_URL}/partner-profile/${id}`, payload).pipe(map((res:any) =>{
            return res as unknown
        }))
    }


    //Get profile partner key expertise        
    getProfilesKeyExpertise():Observable<string[]>{
        return this.read(`${BASE_URL}/partner-profile/list/key-expertise`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }

    //Get profile partner key expertise        
    getProfilesServicesOffered():Observable<string[]>{
        return this.read(`${BASE_URL}/partner-profile/list/services-offered`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }


    //Get profile partner key expertise        
    getProfilesEngagementType():Observable<string[]>{
        return this.read(`${BASE_URL}/partner-profile/list/engagement-type`).pipe(map((res:any) =>{
            return res as string[]
        }))
    }


    //Total number of SME's engaged
    updateNumberOfSMES(id:number):Observable<unknown>{
        return this.put(`${BASE_URL}/partner-profile/${id}/smes-engaged`).pipe(map((res:any) =>{
            return res as unknown
        }))
    }

    //Total number of transactions
    updateTotalNumberOfTransactions(id:number):Observable<unknown>{
        return this.put(`${BASE_URL}/partner-profile/${id}/total-transactions`).pipe(map((res:any) =>{
            return res as unknown
        }))
    }
    //Total number of training sessions
    updateNumberOfTrainingSessions(id:number):Observable<unknown>{
        return this.put(`${BASE_URL}/partner-profile/${id}/training-sessions`).pipe(map((res:any) =>{
            return res as unknown
        }))
    }
    //Total Capital deployed
    updateTotalCapitalDeployed(id:number,data:any):Observable<unknown>{
        return this.putPost(`${BASE_URL}/partner-profile/${id}/capital-deployed`,data).pipe(map((res:any) =>{
            return res as unknown
        }))
    }
}