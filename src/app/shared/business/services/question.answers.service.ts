import { map, of } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { Question } from "../../../features/questions/interfaces";
import { SubMissionStateService } from "./submission-state.service";
import { Submission, UserSubmissionResponse } from "../../interfaces/submission.interface";
import { UserSubmissionsService } from "../../../core/services/storage/user-submissions.service";
import { groupUserDraft, groupUserSubmissions } from "../../../core/utils/group-user-submissions";
import { Answer } from "../../interfaces/Investor";

@Injectable({providedIn: 'root'})

export class QuestionsAnswerService{
    private _submissionStateService =inject(SubMissionStateService);
    private _userSubmissionsService =inject(UserSubmissionsService);

    private _searchAnswersFromSubmissions(submissionResponse:UserSubmissionResponse[], questions: Question[]){
        const questionsSubmitted:Question[] =questions;
        const responses =groupUserSubmissions(submissionResponse);
        responses.forEach(submission =>{
            questions.forEach((q, index) =>{
                if(q.id ===submission.question.id) {
                    questionsSubmitted[index] ={
                        ...q,
                        submissionId: submission.id,
                        defaultValues: submission.answers?.map(answer =>({ answerId: answer.id, text: submission.text??answer.text }))
                    }
                }
            })
        })
        return questionsSubmitted;
    }

    private _searchAnswersFromDrafts(draft:Submission[], questions:Question[]){
        const questionsSubmitted:Question[] =questions;
        let responsesFound =0;
        const draftResponses =groupUserDraft(draft)
        draftResponses.forEach(submission =>{
            questions.forEach((q, index) =>{
                if(q.id ===submission.questionId) {
                    questionsSubmitted[index] ={
                        ...q,
                        submissionId: submission.id,
                        defaultValues: submission.answerIds?.map(answer =>({ answerId: answer, text: submission.text }))
                    }
                responsesFound++;
                }
            })
        });
        return {questionsSubmitted, allFound: responsesFound ===questions.length}
    }

    investorEligibility(questions:Question[]) {
        const draft =this._userSubmissionsService.investorEligibilitySubmissions.flat();
        if(draft.length) {
            const {questionsSubmitted, allFound} =this._searchAnswersFromDrafts(draft, questions);
            if(allFound) return of(questionsSubmitted);
        }
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchAnswersFromSubmissions(res?.investor_eligibility??[], questions);
        }))
    }

    businessInformation(questions:Question[]) {
        const draft =this._userSubmissionsService.businessInformationSubmissions.flat();
        if(draft.length) {
            const {questionsSubmitted, allFound} =this._searchAnswersFromDrafts(draft, questions);
            if(allFound) return of(questionsSubmitted);
        }
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchAnswersFromSubmissions(res?.business_information??[], questions);
        }))
    }

    investorPreparedness(questions:Question[]) {
        const draft =this._userSubmissionsService.investorEligibilitySubmissions.flat();
        if(draft.length) {
            const {questionsSubmitted, allFound} =this._searchAnswersFromDrafts(draft, questions);
            if(allFound) return of(questionsSubmitted);
        }
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchAnswersFromSubmissions(res?.investor_preparedness??[], questions);
        }))
    }

    impactAssessment(questions:Question[]) {
        const draft =this._userSubmissionsService.impactAssessmentSubmissions.flat();
        if(draft.length) {
            const {questionsSubmitted, allFound} =this._searchAnswersFromDrafts(draft, questions);
            if(allFound) return of(questionsSubmitted);
        }
        return this._submissionStateService.getSectionSubmissions().pipe(map(res =>{
            return this._searchAnswersFromSubmissions(res?.impact_assessment??[], questions);
        }))
    }
}