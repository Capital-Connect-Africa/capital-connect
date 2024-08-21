import { Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../../core";
import { MatchingChoices } from "../../interfaces/choice.interface";

@Injectable({providedIn: 'root'})

export class BusinessOnboardingService extends BaseHttpService{

    getQuestionAnswers(){
        const requests =[
            this.read(`${BASE_URL}/use-funds`),
            this.read(`${BASE_URL}/investment-structures`),
            this.read(`${BASE_URL}/esg-focus`),
        ]

        return forkJoin(requests).pipe(map(res =>{
            return {
                use_of_funds: res[0],
                investment_structures: res[1],
                esg_focus: res[2],
            }
        })) as Observable<MatchingChoices>
    }
}