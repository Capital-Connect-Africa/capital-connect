import { Submission, UserSubmissionResponse } from "../../shared";

export const groupUserSubmissions =(submissions: UserSubmissionResponse[]) =>{
    const groupedData:UserSubmissionResponse[] = Object.values(submissions.reduce((acc:any, current) => {
        const questionId = current.question.id;
        if (!acc[questionId]) acc[questionId] = { ...current, answers: [] };
        acc[questionId].answers.push(current.answer);
        return acc;
    }, {}));
    return groupedData;
}

export const groupUserDraft =(submissions: Submission[]) =>{
    const groupedData:Submission[] = Object.values(submissions.reduce((acc:any, current) => {
        const questionId = current.questionId;
        if (!acc[questionId]) acc[questionId] = { ...current, answerIds: [] };
        acc[questionId].answerIds.push(current.answerId);
        return acc;
    }, {}));
    return groupedData;
}