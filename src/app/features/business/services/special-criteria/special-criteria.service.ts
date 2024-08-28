import { inject, Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../../core";
import { CompanyStateService } from "../../../organization/services/company-state.service";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})

export class SpecialCriteriaService extends BaseHttpService {
    private _companyState =inject(CompanyStateService);

    getCompanySpecialCriteria(){
        const companyId =this._companyState.currentCompany.id;
        return this.read(`${BASE_URL}/special-criteria/company/${companyId}`).pipe(map(res =>{
            return res
        }))
    }
}