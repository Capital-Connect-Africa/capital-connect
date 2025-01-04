import { User } from "../../features/users/models"
import { Rule } from "./rule.interface"

export enum VoucherType{
    AdvisorySession ='advisory-session',
    subscriptionPlan ='subscription-plan',
}

export enum UserProperties{
    referredBy,
    createdAt,
    isEmailVerified,
    hasAcceptedTerms,
    roles,
}

export enum Operators{
    EQUAL_TO ='eq',
    LESS_THAN ='lt',
    GREATER_THAN ='gt',
    LESS_THAN_OR_EQUAL_TO ='lte',
    GREATER_THAN_OR_EQUAL_TO ='gte',
    BETWEEN ='between',
    EXISTS ='exists,'
}

export interface VoucherBase{
    type: VoucherType
    maxUses: number
    maxAmount: number
    expiresAt: Date
    percentageDiscount: number
}

export interface VoucherFormData extends VoucherBase{
    rules: number[]

}


export interface VoucherUser {
    id: number;
    user: User;
    usedAt: Date;
}

export interface Voucher extends VoucherBase{
    id: number;
    code: string,
    rules: Rule[];
    createdAt: Date;
    updatedAt: Date;
    users: VoucherUser[]
}
