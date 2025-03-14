import { inject } from "@angular/core";
import { DealPipeline, DealPipelineDto } from "../interfaces/deal.pipeline.interface";
import { patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import { DealsPipelineService } from "../services/deals-pipeline.service";
import { FeedbackService } from "../../../core";

type DealsPipelinesState ={
    payload: DealPipeline[],
    activePipeline: DealPipeline | undefined,
}

const initialState: DealsPipelinesState ={
    payload: [],
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
                    feedbackService.success(error.message);
                }
            }
        })
    )
)