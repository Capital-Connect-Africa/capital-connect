import { User } from "../../users/models";
import { DealStage } from "./deal.stage.interface";

export interface DealPipeline{
    id: number;
    name: string;
    stages: DealStage[];
    maxNumberOfStages?: number;
    owner: User;
    createdAt: Date;
    UpdatedAt: Date;
}

export interface DealPipelineDto {
    ownerId?: number;
    name?: string; // default = 'Default Pipeline'
    maxNumberOfStages?: number; // default = 7
}