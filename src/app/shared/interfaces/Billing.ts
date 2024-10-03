import { User } from "../../features/users/models";

export interface SubscriptionTier{
    description: string
    isActive: boolean
    price: number
    name: string
    id:number
}

export interface SubscriptionResponse {
    orderTrackingId: string
    subscriptionId: number
    redirectUrl: string
    paymentId: number
}

export interface ActivePlan{
    subscriptionTier: SubscriptionTier
    subscriptionDate: Date
    isActive: boolean
    expiryDate: Date
    id: number
}


export interface Plan extends ActivePlan{
    isActive: boolean
    user: User
}

export interface Payment{
    description: string
    currency: string
    createdAt: Date
    amount: number
    status: string
    id: number
}

export interface Booking {
    calendlyEventId: number
    payment: Payment
    createdAt: Date
}

