import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';
import { SidenavComponent } from '../../../../core';
import { DealsPipelinesStore } from '../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DealPipelineDto } from '../../../deals-pipeline/interfaces/deal.pipeline.interface';

@Component({
  selector: 'app-deals-layout',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './deals-layout.component.html',
  styleUrl: './deals-layout.component.scss'
})
export class DealsLayoutComponent {
  private _fb =inject(FormBuilder)
  links =INVESTOR_DASHBOARD_LINKS;
  store =inject(DealsPipelinesStore)

  isPipelineFormVisible =false;
  isPipelineConfigModalVisible =true;

  ngOnInit(){
    this.loadPipelines()
  }

  async loadPipelines(){
    await this.store.loadAll()
  }

  handlePipelineChange(event: Event){
    const target =event.target as HTMLSelectElement;
    const value = +target.value;
    if(!value) return;
    this.store.selectPipeline(value);
  }

  openPipelineSettingsModal(){
    this.isPipelineConfigModalVisible =true;
  }

  pipelineForm =this._fb.group({
    name: ['', [Validators.required]],
    maxNumberOfStages: [7]
  })

  async createNewPipeline(){
    const values =this.pipelineForm.value as Partial<DealPipelineDto>
    if(this.pipelineForm.invalid) return
    await this.store.addNewPipeline(values);
    this.closePipelineForm();
  }

  closePipelineForm(){
    this.pipelineForm.reset();
    this.isPipelineFormVisible =false;
  }

  openPipelineForm(){
    this.isPipelineFormVisible =true;
  }
}
