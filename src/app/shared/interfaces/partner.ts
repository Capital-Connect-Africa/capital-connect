export interface PartnerProfile {
    id:number,
    userId:number,
    name: string,
    category: string,
    country: string,
    region: string,
    website: string,
    description: string,
    keyExpertise: string[],
    services: string[],
    engagementType: string[],
    internalNotes: string
}