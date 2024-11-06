import { map, Observable } from "rxjs";
import { Submission } from "../../../../shared";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../../core";
import { Criteria } from "../../interfaces/special-criteria.interface";

@Injectable({providedIn: 'root'})

export class SpecialCriteriaService extends BaseHttpService {

    getInvestorSpecialCriteria(investorId:number){
        return this.read(`${BASE_URL}/special-criteria/investor-profile/${investorId}`).pipe(map(res =>{
            return res
        })) as Observable<Criteria[]>
    }

    submitSpecialCriteriaQuestions(submissions:Submission[]){
        const payload =submissions.map(submission =>{
            delete submission.id;
            return submission
        });

        return this.create('', payload).pipe(map(res =>{
            return res;
        }))
    }

    listSPecialCriteria(){
        return this.read(`${BASE_URL}/special-criteria/global`).pipe(map(res =>{
            return res
        })) as Observable<Criteria[]>
    }

    listSPecialCriteriaByInvestor(profileId:number){
        return this.read(`${BASE_URL}/special-criteria/investor-profile/${profileId}`).pipe(map(res =>{
            return res
        })) as Observable<Criteria[]>
    }

    getSpecialCriteria(id: number){
        return this.read(`${BASE_URL}/special-criteria/${id}`).pipe(map((res: any) =>{
            return res
        })) as Observable<Criteria>
    }
}