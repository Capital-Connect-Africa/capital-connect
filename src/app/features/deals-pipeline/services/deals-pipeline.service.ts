import { inject, Injectable } from '@angular/core';
import { BASE_URL, BaseHttpService } from '../../../core';
import { AuthStateService } from '../../auth/services/auth-state.service';
import { EMPTY, lastValueFrom, map } from 'rxjs';
import { DealPipeline, DealPipelineDto } from '../interfaces/deal.pipeline.interface';
import { DealStage, DealStageDto } from '../interfaces/deal.stage.interface';
import { Deal, DealDto, DealFormData } from '../interfaces/deal.interface';
import { DealCustomer, DealCustomerDto } from '../interfaces/deal.customer.interface';
import { DealStatus } from '../enums/deal.status.enum';

@Injectable({
  providedIn: 'root'
})
export class DealsPipelineService extends BaseHttpService{

  BASE_LINK =`${BASE_URL}/deal-pipelines`

  private _authStateService =inject(AuthStateService);

  userId:number =this._authStateService.currentUserId();

  async getUserPipelines(): Promise<DealPipeline[]>{
    return lastValueFrom (this.readById(`${this.BASE_LINK}/owner`, this.userId).pipe(map(res =>{
      return res as DealPipeline[]
    })))
  }

  async createNewUserPipeline(payload:Partial<DealPipelineDto>): Promise<DealPipeline>{
    return lastValueFrom(this.create(`${this.BASE_LINK}`, {...payload, ownerId: this.userId}).pipe(map(res =>{
      return res as DealPipeline;
    })))
  }

  async updateUserPipeline(payload:Partial<DealPipelineDto>, pipelineId:number): Promise<DealPipeline>{
    return lastValueFrom(this.update(`${this.BASE_LINK}`, pipelineId, payload).pipe(map(res =>{
      return res as DealPipeline;
    })))
  }

  async removeUserPipeline(pipelineId:number){
    return lastValueFrom(this.delete(`${this.BASE_LINK}`, pipelineId).pipe(map(() =>{
      return EMPTY;
    })))
  }

  async createNewStage(payload: DealStageDto){
    return lastValueFrom(this.create(`${this.BASE_LINK}/stages`, payload).pipe(map(res =>{
      return res as DealStage;
    })))
  }
  async updateStage(payload: Partial<DealStageDto>, stageId:number){
    return lastValueFrom(this.update(`${this.BASE_LINK}/stages`, stageId, payload).pipe(map(res =>{
      return res as DealStage;
    })))
  }

  async removeStage(stageId:number){
    return lastValueFrom(this.delete(`${this.BASE_LINK}/stages`, stageId).pipe(map(() =>{
      return EMPTY;
    })))
  }

  async createDealCustomer(payload: DealCustomerDto){
    return lastValueFrom(this.create(`${this.BASE_LINK}/customers`, payload).pipe(map((res) =>{
      return res as DealCustomer;
    })))
  }

  async createDeal(payload:DealFormData){
    const {name, value, stageId, contactName, contactEmail, contactPhone} =payload;
    const dealCustomer =await this.createDealCustomer({name: contactName, email: contactEmail, phone: contactPhone});
    const deal:DealDto ={name, value, stageId: Number(stageId), status: DealStatus.ACTIVE, customerId: dealCustomer.id}
    return lastValueFrom(this.create(`${this.BASE_LINK}/deals`, deal).pipe(map((res) =>{
      return res as Deal;
    })))
  }

  async updateDeal(payload:Partial<DealDto>, dealId: number){
    return lastValueFrom(this.update(`${this.BASE_LINK}/deals`, dealId, payload).pipe(map((res) =>{
      return res as Deal;
    })))
  }
}
