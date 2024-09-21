import { formatCurrency } from "./format.currency"

export const formatBand =(band:string) =>{
    if(band.toLowerCase() =='seed') return `$${formatCurrency(0)}-$${formatCurrency(100000)}`;
    if(band.toLowerCase() =='preseries') return `$${formatCurrency(100001)}-$${formatCurrency(500000)}`
    if(band.toLowerCase() =='seriesa') return `$${formatCurrency(500001)}-$${formatCurrency(1000000)}`;
    if(band.toLowerCase() =='seriesb') return `$${formatCurrency(1000001)}-$${formatCurrency(3000000)}`;
    if(band.toLowerCase() =='seriesc') return `$${formatCurrency(3000001)}-$${formatCurrency(10000000)}`;
    if(band.toLowerCase() =='growthstage') return `$${formatCurrency(10000001)}-$${formatCurrency(20000000)}`;
    if(band.toLowerCase() =='lategrowthstage') return `$${formatCurrency(20000001)}-$${formatCurrency(50000000)}`;
    if(band.toLowerCase() =='expansionstage') return `$${formatCurrency(50000001)}+`;
    return `Other`;
}