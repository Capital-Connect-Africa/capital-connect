export interface Choice{
    id: number,
    title: string,
    description: string,
}

export interface  MatchingChoices{
    use_of_funds: Choice[],
    investment_structures: Choice[],
    esg_focus: Choice[]
}
