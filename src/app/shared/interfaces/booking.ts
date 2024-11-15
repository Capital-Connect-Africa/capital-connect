
export interface CreateBookingRequest {
    calendlyEventId: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    orderTrackingId: string;
    redirectUrl: string;
    paymentId: number;
}


export interface Invitee {
  email: string;
  displayName: string;
}

export interface Meeting {
  title: string;
  start: string; // ISO date string format
  end: string;   // ISO date string format
  timezone: string;
  invitees: Invitee[];
  bookingId:string
}

export interface MeetingResponse{
  webLink:string
}



export interface Payment {
    id: number;
    currency: string;
    amount: number;
    description: string;
    status: 'initiated' | 'completed' | 'failed'; 
    orderTrackingId: string;
    createdAt: string; 
    updatedAt: string; 
  }
  
  export interface BookingResponse{
    data: Booking[]
  }

  export interface Booking {
    id: number;
    calendlyEventId: string;
    createdAt: string; 
    updatedAt: string; 
    payments: Payment[];
  }