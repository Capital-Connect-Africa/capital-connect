export interface Link { 
    label: string; 
    href?: string;
    exact?: boolean; 
    icon?: string 
}

export interface IconLink extends Link{
    children?: Link[]
}