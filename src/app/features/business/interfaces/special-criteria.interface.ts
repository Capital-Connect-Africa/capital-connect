import { MatchedInvestor } from "../../../shared/interfaces";
import { Question } from "../../questions/interfaces";

export interface Criteria{
    id: number,
    title: string,
    description: string,
    questions: Question[],
    investorProfile: MatchedInvestor,
}