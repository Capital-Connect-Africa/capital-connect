export interface Stats {
  staff: number;
  admin: number;
  business: number;
  investors: number;
  advisors: number;
  connected: number;
  interesting: number;
  declined: number;
  requested: number;
  contact_person: number;
  partner: number;
}

export interface SharedStats {
  companies: Record<string, number>;
  investors: Record<string, number>;
}
