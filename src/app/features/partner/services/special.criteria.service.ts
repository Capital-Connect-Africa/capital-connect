import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../../core";
import { SpecialCriteria } from "../../../shared/interfaces/Investor";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})
export class SpecialCriteriaService extends BaseHttpService{

    findAll(page:number =1, limit:number =10){
        return this.read(`/special-criteria?page=${page}&limit=${limit}`).pipe(map((res) =>{
            return res as SpecialCriteria[]
        }))
    }

    findOne(criteriaId: number){
        return this.readById(`/special-criteria`, criteriaId).pipe(map((res) =>{
            return res as SpecialCriteria
        }))
    }

    save(payload: Partial<SpecialCriteria>){
        return this.create(`/special-criteria`, payload).pipe(map((res) =>{
            return res as SpecialCriteria
        }))
    }

    edit(criteriaId: number, payload: Partial<SpecialCriteria>){
        return this.update(`/special-criteria`, criteriaId, payload).pipe(map((res) =>{
            return res as SpecialCriteria
        }))
    }

    remove(criteriaId:number){
        return this.delete(`/special-criteria`, criteriaId).pipe(map((res) =>{
            return res as SpecialCriteria
        }))
    }

}