import { User } from "../../features/users/models"
import { Rule } from "./rule.interface"

export enum VoucherType{
    AdvisorySession ='advisory-session',
    subscriptionPlan ='subscription-plan',
}

export interface VoucherBase{
    type: VoucherType
    maxUses: number
    maxAmount: number
    expiresAt: Date
    percentageDiscount: number
}

export interface VoucherFormData{
    rules: number[]

}

export interface Voucher extends VoucherBase{
    id: number;
    code: string,
    rules: Rule[];
    createdAt: Date;
    users: User[]
}