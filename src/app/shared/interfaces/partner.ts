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


export interface StaffProfile {
    id:number,
    userId:number,
    fullName: string,
    jobTitle: string,
    department: string,
    headshotUrl: string,
    location: string,
    languages: string,
    expertise: string[],
    personalQuote: string,
    internalNotes: string
}


