import { map } from "rxjs";
import { Submission } from "../../../../shared";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../../core";

@Injectable({providedIn: 'root'})

export class SpecialCriteriaService extends BaseHttpService {

    getCompanySpecialCriteria(investorId:number){
        return this.read(`${BASE_URL}/special-criteria/investor-profile/${investorId}`).pipe(map(res =>{
            return res
        }))
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
}