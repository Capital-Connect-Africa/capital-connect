import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
 { path: '', loadComponent: () => import('../pages/bookings/bookings.component').then(c => c.BookingsComponent)},
 { path: ':id', loadComponent: () => import('../pages/single-booking/single-booking.component').then(c => c.SingleBookingComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }