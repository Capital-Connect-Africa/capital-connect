import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../../core";
import { forkJoin, map } from "rxjs";

@Injectable({providedIn: 'root'})

export class BusinessOnboardingService extends BaseHttpService{
    getQuestionAnswers(){
        const requests =[
            this.read(`${BASE_URL}/use-funds`)
        ]

        return forkJoin(requests).pipe(map(res =>{
            return {
                useOfFunds: res[0]
            }
        }))
    }
}