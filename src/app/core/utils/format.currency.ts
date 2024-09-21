export const formatCurrency = (num: number) => {
    const value = Number(num);
    
    if (value >= 1_000_000_000)  
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'; 
  
    if (value >= 1_000_000) 
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; 
  
    if (value >= 1_000) 
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; 
  
    return value.toString();
  };
  