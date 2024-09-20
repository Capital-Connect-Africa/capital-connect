export const zip =(list1:any[], list2:any[]) =>{
    const length = Math.min(list1.length, list2.length);
    return Array.from({ length }, (_, index) => [list1[index], list2[index]]);  
}