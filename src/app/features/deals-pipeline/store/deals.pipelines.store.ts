import { inject } from "@angular/core";
import { DealPipeline, DealPipelineDto } from "../interfaces/deal.pipeline.interface";
import { patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import { DealsPipelineService } from "../services/deals-pipeline.service";
import { FeedbackService } from "../../../core";
import { DealStage, DealStageDto } from "../interfaces/deal.stage.interface";
import { Deal, DealFormData } from "../interfaces/deal.interface";

export enum PipelineViews {
    KANBAN_VIEW ='Kanban View',
    ANALYTICAL_VIEW ='Analytical View' 
}

export interface DealStats{
    stageDealsCount: {label: string, value: number}[];
    totalDeals: number;
    totalStages: number;
    pendingAmount: number;
    paidAmount: number;
}

type DealsPipelinesState ={
    payload: DealPipeline[],
    currentView: PipelineViews,
    stats: DealStats,
    activePipeline: DealPipeline | undefined,
}


const initialState: DealsPipelinesState ={
    payload: [],
    stats: {paidAmount: 0, pendingAmount: 0, totalStages: 0, totalDeals: 0, stageDealsCount: []},
    currentView: PipelineViews.ANALYTICAL_VIEW,
    activePipeline: undefined
}

export const DealsPipelinesStore =signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(

        (store, pipelineService = inject(DealsPipelineService), feedbackService =inject(FeedbackService)) =>({
            async loadAll(){
                const pipelines =(await pipelineService.getUserPipelines()).sort((a, b) =>a.id - b.id);
                const activePipeline =pipelines.at(0) as DealPipeline;
                patchState(store, {payload: pipelines, activePipeline})
                this.updateStats();
            },

            updateStats(activePipeline:DealPipeline =store.activePipeline() as DealPipeline){
                const stats:DealStats ={
                    stageDealsCount: [],
                    pendingAmount: 0,
                    paidAmount: 0,
                    totalDeals: 0,
                    totalStages: (activePipeline?.stages?? []).length
                };
                (activePipeline?.stages?? []).forEach(stage =>{
                    stats.stageDealsCount.push({label: stage.name, value: stage.deals.length})
                    stats.totalDeals +=stage.deals.length
                    if(stage.progress <100) {
                        stats.pendingAmount +=stage.deals.reduce((prev, curr) =>prev +Number(curr.value), 0)
                    }else{
                        stats.paidAmount +=stage.deals.reduce((prev, curr) =>prev +Number(curr.value), 0)
                    }
                })
                patchState(store, {stats})
            },

            selectPipeline(pipelineId:number){
                const selectedPipeline =store.payload().find(
                    pipeline =>pipeline.id === pipelineId
                )
                if(!selectedPipeline) return;
                patchState(store, state =>({
                    activePipeline: selectedPipeline,
                }))
                this.updateStats(selectedPipeline);
            },

            async addNewPipeline(payload:Partial<DealPipelineDto>){
                try {
                    const newPipeline =await pipelineService.createNewUserPipeline(payload);
                    patchState(store, state =>({
                        payload: [...state.payload, newPipeline].sort((a, b) =>a.id - b.id)
                    }));
                    feedbackService.success(`A new pipeline ${newPipeline.name} has been created`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            async addNewStage(payload: Partial<DealStageDto>){
                try {
                    if(!store.activePipeline()) throw new Error('Select a pipeline')
                    const newStage =await pipelineService.createNewStage({...payload, pipelineId: store.activePipeline()?.id} as DealStageDto);
                    const pipelineStages =[...store.activePipeline()?.stages ?? [], {...newStage, deals: [] as Deal[]}].sort((a, b) =>a.progress - b.progress)
                    patchState(store, {
                        activePipeline: {
                            ...store.activePipeline(), 
                            stages: pipelineStages
                        } as DealPipeline
                    })
                    this.updateStats()
                    feedbackService.success(`A new stage ${payload.name} has been added to ${store.activePipeline()?.name}`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            async updateStage(payload: Partial<DealStageDto>, stageId:number){
                if(!stageId) throw new Error(`Unable to update details of ${payload.name}`);
                try {
                    const stage =await pipelineService.updateStage(payload, stageId);
                    const updatedStage =(store.activePipeline()?.stages??[]).find(stage =>stage.id ===stageId) ;
                    if(!updatedStage) return
                    const pipelineStages =[...store.activePipeline()?.stages ?? []].sort((a, b) =>a.progress - b.progress)
                    pipelineStages[pipelineStages.indexOf(updatedStage)] =stage
                    patchState(store, {
                        activePipeline: {
                            ...store.activePipeline(), 
                            stages: pipelineStages
                        } as DealPipeline
                    })
                    this.updateStats()
                    feedbackService.success(`Details of ${stage.name} have been updated successfully`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            async removeStage(stageId:number){
                if(!stageId) throw new Error(`Error removing selected stage`);
                try {
                    await pipelineService.removeStage(stageId);
                    const pipelineStages =[...store.activePipeline()?.stages ?? []].filter(stage =>stage.id !==stageId).sort((a, b) =>a.progress - b.progress)
                    patchState(store, {
                        activePipeline: {
                            ...store.activePipeline(), 
                            stages: pipelineStages
                        } as DealPipeline
                    })
                    this.updateStats()
                    feedbackService.success(`Stage removed successfully`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            setView(view:PipelineViews){
                patchState(store, {
                    currentView: view
                })
                this.updateStats();
            },

            async addDeal(payload:DealFormData){
                const stages =(store.activePipeline()?.stages ?? []).sort((a, b) =>a.progress - b.progress)
                const initialStage =stages.at(0) as DealStage;
                if(!initialStage) return;
                try{
                    const deal =await pipelineService.createDeal({...payload, stageId: initialStage.id})
                    stages[0].deals.push(deal);
                    patchState(store, {
                        activePipeline: {
                            ...(store.activePipeline() as DealPipeline),
                            stages: stages,
                        }
                    })
                    this.updateStats()
                    feedbackService.success(`Deal ${deal.name} has been created successfully`);
                }
                catch(error:any){
                    feedbackService.error(error.message)
                }
            },

            async updateDealStage(srcStage:DealStage, dstStage:DealStage, dealId:number){
                
                try {
                    const deal =await pipelineService.updateDeal({stageId: dstStage.id}, dealId) 
                    const activePipeline =store.activePipeline() as DealPipeline
                    const stages =activePipeline?.stages;
                    if(!stages) return
                    let srcId:number =-1;
                    let src =(stages.find((stage, index) =>{
                        srcId =index;
                        return stage.id === srcStage.id
                    })?.deals ?? []).filter(dl =>dl.id !== deal.id);
    
                    let dstId:number =-1;
                    const dst =(stages.find((stage, index) =>{
                        dstId =index;
                        return stage.id === dstStage.id
                    })?.deals ?? [])
    
                    stages[srcId].deals =src;
                    stages[dstId].deals =[...dst, deal];
                    patchState(store, {
                        activePipeline: {
                            ...activePipeline,
                            stages
                        }
                    })
                    this.updateStats()
                } catch (error:any) {
                    feedbackService.error(error.message)
                }

            }

        })
    )
)