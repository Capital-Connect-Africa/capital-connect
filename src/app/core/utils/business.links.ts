import { Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class BusinessLinkService {

  constructor() {
  }
  // Method to return processed business links
  getBusinessLinks(value:boolean) {
    return [
      { label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view', display: true },
      { label: 'Plans', href: '/business/plans', exact: false, icon: 'paid', display: value }, // default to false initially
      { label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center', display: true },
      { label: 'Special Criteria', href: '/business/special-criteria', exact: false, icon: 'contact_support', display: true },
      { label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event', display: false },
      { label: 'My Profile', href: '/user-profile', exact: true, icon: 'person', display: true },
    ]
  }
}

export const BusinessLinks = [
    { label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view', display: true },
    { label: 'Plans', href: '/business/plans', exact: false, icon: 'paid', display: false},
    { label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center', display: true },
    { label: 'Special Criteria', href: '/business/special-criteria', exact: false, icon: 'contact_support', display: true },
    { label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event', display: true },
    { label: 'My Profile', href: '/user-profile', exact: true, icon: 'person', display: true },
    { label: 'Financials', href: '/business/financial-reporting', exact: true,   icon: 'bar_chart',  display: true },
];
