import { map } from "rxjs";
import { Injectable } from "@angular/core";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Rule, RuleFormData } from "../../../shared/interfaces/rule.interface";

@Injectable({providedIn: 'root'})
export class RulesService extends BaseHttpService{

    getRules(page:number =1, limit:number =10, all:boolean =false){
        return this.read(`${BASE_URL}/vouchers/rules?page=${page}&limit=${limit}&all=${all}`).pipe(map(res =>{
            return res as Rule[]
        }))
    }

    getRuleById(id: number){
        return this.readById(`${BASE_URL}/vouchers/rules`, id).pipe(map((res:any) =>{
            return res as Rule;
        }))
    }

    updateRule(rule:RuleFormData, id: number){
        return this.update(`${BASE_URL}/vouchers/rules`, id, rule).pipe(map((res:any) =>{
            return res as Rule;
        }))
    }

    removeRule(id:number){
        return this.delete(`${BASE_URL}/vouchers/rules`, id).pipe(map((res:any) =>{
            return 
        }))
    }

    createRule(rule:Partial<RuleFormData>){
        return this.create(`${BASE_URL}/vouchers/rules`, rule).pipe(map((res:any) =>{
            return res as Rule
        }))
    }
}