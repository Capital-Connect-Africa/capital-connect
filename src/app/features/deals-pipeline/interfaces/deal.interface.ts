import { DealStatus } from "../enums/deal.status.enum";
import { DealCustomer } from "./deal.customer.interface";

export interface Deal{
    id: number;
    name: string;
    value: number;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date;
    status: DealStatus,
    customer: DealCustomer;
}

export interface DealDto {
    name: string;
    value: number;
    stageId: number;
    customerId: number;
    status?: DealStatus;
    closureDate?: Date;
}


export interface DealFormData{
    name: string;
    value: number;
    stageId?: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
}