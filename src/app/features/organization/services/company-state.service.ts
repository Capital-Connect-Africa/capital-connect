import { Injectable, signal, WritableSignal } from '@angular/core';
import { Company } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CompanyStateService {
  private _currentCompanySrc: WritableSignal<Company> = signal(JSON.parse(sessionStorage.getItem('currentCompany') as string)  as Company);

  setCompany(company: Company) {
    sessionStorage.setItem('currentCompany', JSON.stringify(company));
    this._currentCompanySrc.set(company);
  }

  get currentCompany(): Company {
    const company  = !!this._currentCompanySrc() ? this._currentCompanySrc() :JSON.parse(sessionStorage.getItem('currentCompany') as string)  as Company
    return company
  }

  resetCompany() {
    sessionStorage.removeItem('currentCompany')
    return this._currentCompanySrc.set(null as any)
  }

  get companyDetailsCaptured(){
    const comapany =this.currentCompany;
    return !!comapany.growthStage && !!comapany.id && !!comapany.investmentStructure && !!comapany.fundsNeeded && !!comapany.esgFocusAreas && !!comapany.businessSector && !!comapany.businessSubsector && !!comapany.country && !!comapany.name && !!comapany.numberOfEmployees

  }

}
