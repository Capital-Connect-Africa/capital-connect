export interface Stats{
        staff: number,
        business: number,
        investors: number,
        advisors: number,
        connected: number,
        interesting: number,
        declined: number,
        requested: number,
}

export interface SharedStats {
        companies: Record<string, number>,
        investors: Record<string, number>
}