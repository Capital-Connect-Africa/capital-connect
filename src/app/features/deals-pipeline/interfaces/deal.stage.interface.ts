import { Deal } from "./deal.interface";

export interface DealStage{
    id: number;
    name: string;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
    deals: Deal[];
}

export interface DealStageDto{
    pipelineId: number;
    name: string;
    progress: number;
}