export const customFormatDate =(date:Date, isNull:boolean) =>{
    const weekDay =['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year =date.getFullYear();
    const month =date.getMonth();
    const day =date.getDay();
    const monthDay =date.getDate();
    const hours =date.getHours();
    const minutes =date.getMinutes();
    let hours12 =hours % 12;
    hours12 = hours12 ? hours12 : 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return {
        // TODO: add what a field of the format you want
        wdddmmyr: isNull? '-' :`${weekDay[day]} ${monthDay < 10? '0'+monthDay: monthDay} ${months[month]}, ${year}`,
        time12hrs: isNull? '-' : `${hours12 <10? '0'+hours12 : hours12}:${minutes <10? '0'+minutes: minutes} ${ampm}`,
        time24hrs: isNull? '-' :`${hours}:${minutes <10? '0'+minutes: minutes}`,
        time: date.getTime()
    }
}


export const customFormatDuration =(durationMs:number) =>{
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the duration
    if (durationHours === 0) {
        return `${durationMinutes}mins`; // Only minutes
    } else if (durationMinutes === 0) {
        return `${durationHours}hr`; // Only hours
    } else {
        return `${durationHours}hr ${durationMinutes}mins`; // Hours and minutes
    }
}