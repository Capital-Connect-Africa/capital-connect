import { map } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Injectable } from "@angular/core";
import { AdvisorProfile } from "../../../shared/interfaces/advisor.profile";

@Injectable({ providedIn: 'root' })
export class AdvisorService extends BaseHttpService {

    //create advisor profile
    createAdvisorProfile(advisorProfile: AdvisorProfile) {
        return this.create(`${BASE_URL}/advisor-profile`, advisorProfile).pipe(map((res: any) => {
            return res as unknown;
        }))
    }

    //get advisor profile by id
    getAdvisorProfileBy(id: number) {
        return this.readById(`${BASE_URL}/advisor-profile`, id).pipe(map((res: any) => {
            return res as AdvisorProfile;
        }))
    }

    //get advisor profile by User id
    getAdvisorProfileByUserId(id: number) {
        return this.readById(`${BASE_URL}/advisor-profile/user`, id).pipe(map((res: any) => {
            return res as AdvisorProfile;
        }))
    }


    //Get all advisor profiles
    getAllAdvisorProfiles() {
        return this.read(`${BASE_URL}/advisor-profile`).pipe(map((res: any) => {
            return res as AdvisorProfile[];
        }))
    }

    //Get all advisor profile roles
    getAllAdvisorProfileRoles() {
        return this.read(`${BASE_URL}/advisor-profile/list/roles`).pipe(map((res: any) => {
            return res as string[];
        }))
    }


    //Get all advisor profile services offered
    getAllAdvisorProfileServices() {
        return this.read(`${BASE_URL}/advisor-profile/list/services-offered`).pipe(map((res: any) => {
            return res as string[];
        }))
    }

    //Get all advisor profile fee structure
    getAllAdvisorProfileFeeStructure() {
        return this.read(`${BASE_URL}/advisor-profile/list/fee-structure`).pipe(map((res: any) => {
            return res as string[];
        }))
    }

    //update advisor profile
    updateAdvisorProfile(advisorProfile: AdvisorProfile) {
        return this.putPost(`${BASE_URL}/advisor-profile`, advisorProfile).pipe(map((res: any) => {
            return res as unknown;
        }))
    }
}