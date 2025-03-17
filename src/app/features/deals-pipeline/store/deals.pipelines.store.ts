import { inject } from "@angular/core";
import { DealPipeline, DealPipelineDto } from "../interfaces/deal.pipeline.interface";
import { patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import { DealsPipelineService } from "../services/deals-pipeline.service";
import { FeedbackService } from "../../../core";
import { DealStage, DealStageDto } from "../interfaces/deal.stage.interface";
import { DealFormData } from "../interfaces/deal.interface";

export enum PipelineViews {
    KANBAN_VIEW ='Kanban View',
    LIST_VIEW ='List View' 
}

type DealsPipelinesState ={
    payload: DealPipeline[],
    currentView: PipelineViews,
    activePipeline: DealPipeline | undefined,
}


const initialState: DealsPipelinesState ={
    payload: [],
    currentView: PipelineViews.KANBAN_VIEW,
    activePipeline: undefined
}

export const DealsPipelinesStore =signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(

        (store, pipelineService = inject(DealsPipelineService), feedbackService =inject(FeedbackService)) =>({
            async loadAll(){
                const pipelines =(await pipelineService.getUserPipelines()).sort((a, b) =>a.id - b.id);
                patchState(store, {payload: pipelines, activePipeline: pipelines.at(0)})
            },

            selectPipeline(pipelineId:number){
                patchState(store, state =>({
                    activePipeline: state.payload.find(
                        pipeline =>pipeline.id === pipelineId
                    )
                }))
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
                    const pipelineStages =[...store.activePipeline()?.stages ?? [], newStage].sort((a, b) =>a.progress - b.progress)
                    patchState(store, {
                        activePipeline: {
                            ...store.activePipeline(), 
                            stages: pipelineStages
                        } as DealPipeline
                    })
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
                    feedbackService.success(`Stage removed successfully`);
                } catch (error:any) {
                    feedbackService.error(error.message);
                }
            },

            setView(view:PipelineViews){
                patchState(store, {
                    currentView: view
                })
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
                    feedbackService.success(`Deal ${deal.name} has been created successfully`);
                }
                catch(error:any){
                    feedbackService.error(error.message)
                }
            }
        })
    )
)