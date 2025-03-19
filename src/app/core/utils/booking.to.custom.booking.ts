import { Booking, CustomBooking } from "../../shared/interfaces/Billing";
import { customFormatDate } from "./format.date.util";

export const castBookingToCustomBooking =(booking:Booking | null) =>{
    if(!booking) return {} as Partial<CustomBooking>
    const starts =customFormatDate(new Date(booking.meetingStartTime), !booking.meetingStartTime);
    const stops =customFormatDate(new Date(booking.meetingEndTime), !booking.meetingEndTime);
    return {
        id: booking.id,
        date: booking.meetingStartTime,
        starts: starts.time12hrs,
        stops: stops.time12hrs,
        meetingLink: booking.meetingLink,
        duration: stops.time - starts.time,
        createdAt: booking.createdAt,
        formatedStart: starts.wdddmmyr,
        formatedStop: stops.wdddmmyr,
        client: (`${booking.user.firstName??''} ${booking.user.lastName??''}`.trim()) || '-',
        advisor: (`${booking.advisor?.firstName || ''} ${booking.advisor?.lastName || ''}`.trim()) || '-',
    } as CustomBooking;
}