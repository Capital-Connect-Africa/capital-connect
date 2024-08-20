import { SubMissionStateService } from "./submission-state.service";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})


export class RoutingService{
    private _submissionService =inject(SubMissionStateService)

    nextRoute() {
        const urls: {title?: string, url: string}[] =[];
        const init$ =this._submissionService.getSectionSubmissions().pipe(map(res =>{
            if(!res) return urls;

            if([...Object.values(res)].some((v:[]) =>!v.length)) {
                if(!res.investor_eligibility.length) urls.push({url:'/business/investor-eligibility', title: 'Investor Eligibility'});
                if(!res.investor_preparedness.length) urls.push({url: '/business/investor-preparedness', title: 'Investor Preparedness'});
                if(!res.business_information.length) urls.push({url:'/business/financials', title: 'Business Information'})
                if(!res.impact_assessment.length) urls.push({url: '/business/impact-assessment', title: 'Impact Assessment'})
                return urls;
            }
            return [{url: '/business'}];
        }))
        return init$;
    }
}