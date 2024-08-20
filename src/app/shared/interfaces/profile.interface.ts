export interface Profile{
    name: string,
    email: string,
    mobileNumber: string,
    company: {name: string, isFullTime: boolean, logo: string, location: string},
}