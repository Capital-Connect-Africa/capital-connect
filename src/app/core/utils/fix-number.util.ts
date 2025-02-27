export const fixNumber =(v:number, dp=2) =>{
    return v.toFixed(v % 1 && dp)
}