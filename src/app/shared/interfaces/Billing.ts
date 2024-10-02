export interface SubscriptionTier{
    id:number;
    name: string,
    description: string,
    price: number,
    isActive: boolean,
}

export interface SubscriptionResponse {
    subscriptionId: number,
    orderTrackingId: string,
    redirectUrl: string,
    paymentId: number
}

export interface ActivePlan{
    id: number,
    expiryDate: Date,
    isActive: boolean,
    subscriptionDate: Date,
    subscriptionTier: SubscriptionTier
}