export interface Choice{
    id: number,
    title: string,
    description: string,
}

export interface  InvestorMatchingQuestions{
    esg_focus: Choice[]
    use_of_funds: Choice[],
    stage_of_growth: Choice[],
    years_of_operation: Choice[],
    number_of_employees: Choice[],
    investment_structures: Choice[],
    registration_structure: Choice[],
}
