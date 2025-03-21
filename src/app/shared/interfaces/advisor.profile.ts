import { User } from "../../features/users/models";

export interface AdvisorProfile{
    id:number;
    userId: number,
    fullName: String,
    roles: string[],
    email: string,
    phone: string,
    website: string,
    professionalSummary: string,
    personalPitch: string,
    capitalRaisingStrategies: string,
    industryFocus: string,
    countryFocus: string,
    servicesOffered: string,
    pastProjects: string,
    totalCapitalRaised: number,
    caseStudies: string,
    totalTeamMembers: number,
    totalYearsExperience: number,
    keyTeamMembers: string,
    feeStructure: string
    user:User

}