import { Component, inject } from '@angular/core';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { Observable, tap } from 'rxjs';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { SearchEngineService } from '../../services/search-engine.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-funders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funders.component.html',
  styleUrl: './funders.component.scss'
})
export class FundersComponent {
  private _route =inject(Router);
  private _activatedRoute =inject(ActivatedRoute);
  private _authStateService =inject(AuthStateService);
  private _searchEngineService =inject(SearchEngineService);
  private _publicInvestorService = inject(PublicInvestorsRepositoryService);

  
  q =this._activatedRoute.snapshot.params['search-key']
  total =0
  matches =0;
  searchedResults$ =this._searchEngineService.results$.pipe(tap(res =>{
    if(res.investors){
      this.publicInvestors =res.investors
      this.total =res.total ?? 0;
      this.matches =res.matches ?? 0;
    }else{
      this.getPublicInvestors()
    }
  }))

  publicInvestors: PublicInvestor[] = [];
  publicInvestors$ =new Observable();
  ngOnInit(){
    if(this._authStateService.isLoggedIn){
      this._route.navigateByUrl('/business/investors-db');
    }
  }

  getPublicInvestors(){
    this.publicInvestors$ =this._publicInvestorService.searchInvestors({query: this.q}).pipe(tap(res =>{
      this.publicInvestors =res.investors
      this.total =res.total
      this.matches =res.matches
      this.q =res.q;
    }))
  }

  signup(){
    this._route.navigateByUrl('/signup');
  }
  signin(){
    this._route.navigateByUrl('/auth');
  }
  
}
