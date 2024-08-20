import { map } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { Question } from "../../../features/questions/interfaces";
import { SubMissionStateService } from "./submission-state.service";
import { UserSubmissionResponse } from "../../interfaces/submission.interface";

@Injectable({providedIn: 'root'})

export class QuestionsAnswerService{
    private _submissionStateService =inject(SubMissionStateService);

    private _searchQuestions(submissionResponse:UserSubmissionResponse[], questions: Question[]){
        const questionsSubmitted:Question[] =[];
        submissionResponse.forEach(submission =>{
            questions.forEach(q =>{
                if(q.id ===submission.question.id) questionsSubmitted.push({
                    ...q,
                    submissionId: submission.id,
                    defaultValues:[ { answerId: submission.answer.id, text: submission.answer.text } ]
                })
            })
        })
        return questionsSubmitted;
    }

    investorEligibilityQuestionsAnswers(questions:Question[]) {
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchQuestions(res?.investor_eligibility??[], questions);
        }))
    }
}