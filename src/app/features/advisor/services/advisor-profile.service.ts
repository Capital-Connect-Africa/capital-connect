import { map } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Injectable } from "@angular/core";
import { AdvisorProfile } from "../../../shared/interfaces/advisor.profile";

@Injectable({providedIn: 'root'})
export class AdvisorService extends BaseHttpService{

    //create advisor profile
    createAdvisorProfile(advisorProfile:AdvisorProfile){
        return this.create(`${BASE_URL}/advisor-profile`, advisorProfile).pipe(map((res:any) =>{
            return res as unknown;
        }))
    }

    //get advisor profile by id
    getAdvisorProfileBy(id: number){
        return this.readById(`${BASE_URL}/advisor-profile`, id).pipe(map((res:any) =>{
            return res as AdvisorProfile;
        }))
    }

    //Get all advisor profiles
    getAllAdvisorProfiles(id: number){
        return this.read(`${BASE_URL}/advisor-profile`).pipe(map((res:any) =>{
            return res as AdvisorProfile[];
        }))
    }

    //update advisor profile
    updateAdvisorProfile(advisorProfile:AdvisorProfile){
        return this.putPost(`${BASE_URL}/advisor-profile`, advisorProfile).pipe(map((res:any) =>{
            return res as unknown;
        }))
    }
}