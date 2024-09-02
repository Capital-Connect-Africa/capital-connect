import { Company } from "../../features/organization/interfaces";

export interface Profile{
    name: string,
    email: string,
    mobileNumber: string,
    company: Company,
}