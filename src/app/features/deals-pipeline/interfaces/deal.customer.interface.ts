export interface DealCustomer{
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface DealCustomerDto {
    name?: string;
    email?: string;
    phone?: string;
    userId?: number;
  }
  