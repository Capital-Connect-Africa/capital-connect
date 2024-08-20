import { map, of } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { Question } from "../../../features/questions/interfaces";
import { SubMissionStateService } from "./submission-state.service";
import { Submission, UserSubmissionResponse } from "../../interfaces/submission.interface";
import { UserSubmissionsService } from "../../../core/services/storage/user-submissions.service";

@Injectable({providedIn: 'root'})

export class QuestionsAnswerService{
    private _submissionStateService =inject(SubMissionStateService);
    private _userSubmissionsService =inject(UserSubmissionsService);

    private _searchAnswersFromSubmissions(submissionResponse:UserSubmissionResponse[], questions: Question[]){
        const questionsSubmitted:Question[] =questions;
        submissionResponse.forEach(submission =>{
            questions.forEach((q, index) =>{
                if(q.id ===submission.question.id) questionsSubmitted[index] ={
                    ...q,
                    submissionId: submission.id,
                    defaultValues:[ { answerId: submission.answer.id, text: submission.answer.text } ]
                }
            })
        })
        return questionsSubmitted;
    }

    private _searchAnswersFromDrafts(draft:Submission[], questions:Question[]){
        const questionsSubmitted:Question[] =questions;
        draft.forEach(submission =>{
            questions.forEach((q, index) =>{
                if(q.id ===submission.questionId) questionsSubmitted[index] ={
                    ...q,
                    submissionId: submission.id,
                    defaultValues:[ { answerId: submission.answerId, text: submission.text } ]
                }
            })
        })
        return questionsSubmitted;
    }

    investorEligibilityQuestionsAnswers(questions:Question[]) {
        const draft =this._userSubmissionsService.investorEligibilityDraft.flat();
        if(draft.length) return of(this._searchAnswersFromDrafts(draft, questions));
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchAnswersFromSubmissions(res?.investor_eligibility??[], questions);
        }))
    }
}