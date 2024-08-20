import { UserSubmissionResponse } from "./submission.interface";

export interface SectionSubmissions {
    business_information: UserSubmissionResponse[],
    investor_eligibility: UserSubmissionResponse[],
    investor_preparedness: UserSubmissionResponse[],
    impact_assessment: UserSubmissionResponse[],
}