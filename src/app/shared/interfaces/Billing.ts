import { User } from "../../features/users/models";

export interface SubscriptionTier{
    description: string
    isActive: boolean
    price: number
    name: string
    id:number
    features:string[]
}

export enum PAYMENT_STATUS{
    FAILED ='failed',
    COMPLETED ='completed',
    INITIATED ='initiated',
}

export interface SubscriptionResponse {
    orderTrackingId: string
    subscriptionId: number
    redirectUrl: string
    paymentId: number
}

export interface VoucherRedeemResponse{
    code: string,
    discount: number,
    maxAmount: number,

}

export interface ActivePlan{
    subscriptionTier: SubscriptionTier
    subscriptionDate: Date
    payment: Payment,
    isActive: boolean
    expiryDate: Date
    id: number
}


export interface Plan extends ActivePlan{
    isActive: boolean
    user: User,
}

export interface Payment{
    description: string
    currency: string
    createdAt: Date
    updatedAt: Date
    amount: number
    status: PAYMENT_STATUS
    id: number
    user: User
}

export interface Booking {
    id:number,
    calendlyEventId: string
    payment: Payment
    createdAt: Date,
    advisor:Advisor,
    notes:string,
    user:User,
    meetingEndTime:string,
    meetingStartTime:string,
    meetingId:string,
    meetingLink:string,

}

export interface PaymentPlan extends Payment{
    userSubscription: ActivePlan,
    orderTrackingId: string,
    booking: Booking | null,
}


export interface Advisor{
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    roles: string,
    resetPasswordToken: string,
    resetPasswordExpires: string,
    isEmailVerified: boolean,
    emailVerificationToken: string,
    emailVerificationExpires: string,
    hasAcceptedTerms: boolean,
    termsAcceptedAt: string,
    createdAt: string,
    updatedAt: string
}

export interface CustomBooking { 
    id:number, 
    date: Date | string, 
    meetingLink: string, 
    createdAt: Date,
    starts: string, 
    stops: string, 
    duration: number, 
    client: string, 
    advisor: string,
    formatedStart: string;
    formatedStop: string;
}