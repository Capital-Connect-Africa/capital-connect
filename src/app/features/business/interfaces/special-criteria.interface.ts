import { Question } from "../../questions/interfaces";

export interface Criteria{
    title: string, 
    description: string
    questions: Question[],
}