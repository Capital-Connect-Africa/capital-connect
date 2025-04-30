import { Sector } from '../../sectors/interfaces';
import { inject, Injectable } from '@angular/core';
import { Country } from '../../../shared/interfaces/countries';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { UseOfFundsOptions } from '../../../shared/interfaces/Investor';
import { PublicInvestor, UserSearch } from '../../../shared/interfaces/public.investor.interface';
import { PublicInvestorsRepositoryService } from '../../../core/services/investors/public-investors-repository.service';
import { BASE_URL, BaseHttpService } from '../../../core';

@Injectable({ providedIn: 'root' })
export class SearchEngineService extends BaseHttpService{

    private results$$ =new BehaviorSubject<{q?: string, investors?: PublicInvestor[], total?: number, matches?: number}>({})
    results$ =this.results$$.asObservable();
    private _publicInvestorService = inject(PublicInvestorsRepositoryService);

    getAllSectors(){
        return this.read(`${BASE_URL}/sectors/list/global?page=1&limit=100`) as Observable<Sector[]>
    }

    getAllCountries(){
        return this.read(`${BASE_URL}/countries/list/global`) as Observable<Country[]>
    }

    getAllUseOfFunds(){
        return this.read(`${BASE_URL}/use-funds/list/global?page=1&limit=100`) as Observable<UseOfFundsOptions[]>
    }

    fetchOptions(){
        const requests =[this.getAllSectors(), this.getAllCountries(), this.getAllUseOfFunds()]
        return combineLatest(requests).pipe(map(res =>{
            const [sectors, countries, useOfFunds] =res
            return {
                sectors: sectors as Sector[],
                useOfFunds: (useOfFunds as UseOfFundsOptions[]).map(useOfFund =>useOfFund.title),
                countries: (countries as Country[]).map(country =>country.name)
            }
        }))
    }

    searchInvestors(payload: Partial<UserSearch>){
        return this._publicInvestorService.searchInvestors(payload).pipe(map(res =>{
            this.results$$.next(res);
            return res
        }))
    }

}
