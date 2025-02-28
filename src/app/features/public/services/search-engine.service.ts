import { inject, Injectable } from '@angular/core';
import { CountriesService } from '../../../shared/services/countries.service';
import { InvestorScreensService } from '../../investor/services/investor.screens.service';
import { SectorsService } from '../../sectors/services/sectors/sectors.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Country } from '../../../shared/interfaces/countries';
import { Sector } from '../../sectors/interfaces';
import { UseOfFundsOptions } from '../../../shared/interfaces/Investor';
import { PublicInvestor, UserSearch } from '../../../shared/interfaces/public.investor.interface';
import { PublicInvestorsRepositoryService } from '../../../core/services/investors/public-investors-repository.service';

@Injectable({ providedIn: 'root' })
export class SearchEngineService {

    private results$$ =new BehaviorSubject<{query?: string, investors?: PublicInvestor[]}>({})
    results$ =this.results$$.asObservable();

    private _sectorsService = inject(SectorsService);
    private _countriesService = inject(CountriesService);
    private _investorsService = inject(InvestorScreensService);
    private _publicInvestorService = inject(PublicInvestorsRepositoryService);

    fetchOptions(){
        const requests =[this._sectorsService.getAllSectors(), this._countriesService.getCountries(), this._investorsService.getUseOfFunds()]
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
