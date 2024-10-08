import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { map, Observable } from "rxjs";
import { Booking, Payment } from "../../../shared/interfaces/Billing";

@Injectable({providedIn: 'root'})

export class BookingsService extends BaseHttpService{

    getBookings(page: number =1, limit:number =5){
        return this.read(`${BASE_URL}/bookings?page=${page}&limit=${limit}`).pipe(map((bookings: any[]) =>{
          return bookings.map((booking: any) =>{
            const payment =booking.payments.reduce((curr: Payment, acc:Payment) =>{
                return {
                    id: curr.id || acc.id,
                    createdAt: curr.createdAt || acc.createdAt,
                    currency: curr.currency || acc.currency,
                    amount: curr.amount + acc.amount,
                    description: curr.description || acc.description,
                    status: curr.status.length && acc.status.length? curr.status === acc.status? acc.status: 'partial': (curr.status || acc.status) || 'initited'
                }
            }, {id: null, amount: 0, currency: '', status: '', createdAt: '', description: ''});
            return {
                ...booking,
                payment: payment
            }
          })
        })) as Observable<Booking[]>
    }

    deleteBooking(bookingId: number){
        return this.delete(`${BASE_URL}/bookings`, bookingId).pipe(map(res =>{
            return res
        }))
    }

    getBooking(bookingId: number){
        return this.readById(`${BASE_URL}/bookings`, bookingId).pipe(map(res =>{
            debugger
            return res
        })) as Observable<Booking>
    }
}