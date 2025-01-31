export interface ReferralLeader {
  rank: number;
  name: string;
  clicks: number;
  visits: number;
  signups: number;
  rate: number;
}

export interface ReferralPayload {
  referrals: ReferralLeader[];
  total_count: number;
}
