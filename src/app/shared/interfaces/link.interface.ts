export interface LinkItem{
    label: string,
    href?: string,
    exact?: boolean,
    icon?: string,
    display?: boolean,
}

export interface Link extends LinkItem{
    children?: Link[]
}