import { inject } from "@angular/core";
import { DealPipeline, DealPipelineDto } from "../interfaces/deal.pipeline.interface";
import { patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import { DealsPipelineService } from "../services/deals-pipeline.service";
import { FeedbackService } from "../../../core";
import { DealStage, DealStageDto } from "../interfaces/deal.stage.interface";
import { Deal, DealDto, DealFormData } from "../interfaces/deal.interface";
import { DealStatus } from "../enums/deal.status.enum";
import { ChildEventsService } from "../services/child.events.service";

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
    lostAmount: number;
}

type DealsPipelinesState ={
    payload: DealPipeline[],
    currentView: PipelineViews,
    stats: DealStats,
    currentlySelectedDeal: Deal | undefined,
    activePipeline: DealPipeline | undefined,
}


const initialState: DealsPipelinesState ={
    payload: [],
    stats: { paidAmount: 0, pendingAmount: 0, totalStages: 0, totalDeals: 0, lostAmount: 0, stageDealsCount: []},
    currentView: PipelineViews.KANBAN_VIEW,
    activePipeline: undefined,
    currentlySelectedDeal: undefined
}

export const DealsPipelinesStore =signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(

        (store, pipelineService = inject(DealsPipelineService), feedbackService =inject(FeedbackService), childEvents =inject(ChildEventsService)) =>({
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
                    lostAmount: 0,
                    totalStages: (activePipeline?.stages?? []).length
                };
                (activePipeline?.stages?? []).forEach(stage =>{
                    stats.stageDealsCount.push({label: stage.name, value: stage.deals.length})
                    stats.totalDeals +=stage.deals.length
                    stats.pendingAmount +=stage.deals.reduce((prev, curr) =>prev +Number(curr.status === DealStatus.ACTIVE? curr.value: 0 ), 0)
                    stats.paidAmount +=stage.deals.reduce((prev, curr) =>prev +Number(curr.status === DealStatus.WON? curr.value: 0 ), 0)
                    stats.lostAmount +=stage.deals.reduce((prev, curr) =>prev +Number([DealStatus.LOST, DealStatus.CANCELLED].includes(curr.status)? curr.value: 0 ), 0)
                    
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

            async editPipeline(payload:Partial<DealPipelineDto>){
                try {
                    let pipelineIndex =-1
                    const selectedPipeline =store.payload().find((pipeline, index) =>{
                        pipelineIndex =index;
                        return pipeline.id === store.activePipeline()?.id
                    }) as DealPipeline;
                    if(!selectedPipeline) return;
                    const pipeline =await pipelineService.updateUserPipeline(payload, store.activePipeline()?.id as number);
                    debugger
                    const pipelines =store.payload();
                    pipelines[pipelineIndex] =pipeline;
                    patchState(store, {
                        payload: pipelines.sort((a, b) =>a.id - b.id),
                        activePipeline: {...selectedPipeline, ...pipeline}
                    });
                    this.updateStats();
                    feedbackService.success(`Details of ${pipeline.name} pipeline have been updated successfully`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            async removePipeline(pipelineId:number){
                try {
                    await pipelineService.removeUserPipeline(pipelineId);
                    const selectedPipeline =store.payload().find(pipeline =>pipeline.id === pipelineId) as DealPipeline;
                    if(!selectedPipeline || selectedPipeline.stages.length) return;
                    const pipelines =store.payload().filter(pipeline =>pipeline.id !== pipelineId).sort((a, b) =>a.id - b.id)
                    patchState(store,{
                        payload: pipelines,
                        activePipeline: pipelines.at(0)
                    });
                    this.updateStats();
                    feedbackService.success(`Pipeline removed successfully`);
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
                    pipelineStages[pipelineStages.indexOf(updatedStage)] ={...updatedStage,...stage}
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
                    let payload:Partial<DealDto> ={}
                    if(dstStage.progress >=100) payload ={closureDate: new Date(), status: DealStatus.WON}
                    else payload ={ closureDate: undefined, status: DealStatus.ACTIVE }
                    const deal =await pipelineService.updateDeal({stageId: dstStage.id, ...payload}, dealId) 
                    const activePipeline =store.activePipeline() as DealPipeline;
                    const stages =activePipeline?.stages;
                    if(!stages) return;
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
                    this.updateStats();
                    return deal;
                } catch (error:any) {
                    feedbackService.error(error.message)
                    return
                }

            },

            async updateDeal(payload:Partial<DealDto>, dealId:number, mode: 'Write' | 'Read' ='Read'){
                try {
                    const {stageId} =payload;
                    let finalStage:DealStage | undefined;
                    const activePipeline = store.activePipeline() as DealPipeline;
                    const pipelineStages =activePipeline?.stages;
                    if(!pipelineStages) return
                    let dealStageIndex =-1;
                    let dealIndex =-1;
                    const dealStage =pipelineStages.find((stage, index) =>{
                        dealStageIndex =index;
                        return stage.deals.map((deal) =>deal.id).includes(dealId)
                    }) as DealStage;

                    if(!dealStage) return;

                    const dealToBeUpdated =dealStage?.deals.find((deal, index) =>{
                        dealIndex =index;
                        return deal.id === dealId;
                    }) as Deal

                    if(stageId){
                        finalStage =pipelineStages.find(stage =>stage.id === stageId && stage.progress >=100)
                    }
                    if(finalStage){
                        const updatedDeal =await this.updateDealStage(dealStage, finalStage, dealId);
                        patchState(store, {
                            currentlySelectedDeal: {...dealToBeUpdated, ...updatedDeal}
                        })
                    } else {
                        
                        
                        const updatedDeal =await pipelineService.updateDeal(payload, dealId);
                        dealStage.deals[dealIndex] ={...dealToBeUpdated, ...updatedDeal}
                        pipelineStages[dealStageIndex] =dealStage;
                        patchState(store, {
                            activePipeline: {
                                ...activePipeline, 
                                stages: pipelineStages,
                            },
                            currentlySelectedDeal: {...dealToBeUpdated, ...updatedDeal}
                        })
                        this.updateStats();
                    }

                    childEvents.emitDealSelectedEvent(mode)
                } catch (error:any) {
                    feedbackService.error(error.message)
                }
            },

            setCurrentlySelectedDeal(deal: Deal | undefined){
                patchState(store, {
                    currentlySelectedDeal: deal
                })
            }
        })
    )
)