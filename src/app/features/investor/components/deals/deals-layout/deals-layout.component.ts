import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../../shared/routes/investor-dashboard-routes';
import { SidenavComponent } from '../../../../../core';
import { DealsPipelinesStore, PipelineViews } from '../../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DealPipelineDto } from '../../../../deals-pipeline/interfaces/deal.pipeline.interface';
import { generateCryptCode } from '../../../../../core/utils/crypto.code.generator';
import { DealCustomerDto } from '../../../../deals-pipeline/interfaces/deal.customer.interface';
import { DealFormData } from '../../../../deals-pipeline/interfaces/deal.interface';

interface Field {
  id: string, progress: string, name:string, stageId?:number, action: 'edit' | 'create', selected:boolean
}

@Component({
  selector: 'app-deals-layout',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, CommonModule, ModalComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './deals-layout.component.html',
  styleUrl: './deals-layout.component.scss'
})
export class DealsLayoutComponent {
  MAX_STAGES_COUNT:number =7;
  
  VIEWS =PipelineViews

  private _fb =inject(FormBuilder);


  links =INVESTOR_DASHBOARD_LINKS;
  store =inject(DealsPipelinesStore);
  stageFields:Field[] =[]
  
  isContactFormVisible =false;
  isPipelineFormVisible =false;
  isDealFormModalVisible =false;
  isPipelineConfigModalVisible =false;

  ngOnInit(){
    this.loadPipelines()
  }

  updateStageFields(){
    this.stageFields =[];
    if((this.store.activePipeline()?.stages??[]).length){
      this.store.activePipeline()?.stages.sort((a, b) =>a.progress - b.progress).forEach(stage =>{
        if(this.stageFields.length >=(this.store.activePipeline()?.maxNumberOfStages ?? this.MAX_STAGES_COUNT)) return
        this.stageFields.push({
          id: generateCryptCode(),
          name: stage.name,
          progress: `${stage.progress}%`,
          selected: false,
          stageId: stage.id,
          action: 'edit',
        })
      })
    }
    
    else this.addInputField();
  }

  async loadPipelines(){
    await this.store.loadAll();
    this.updateStageFields();
  }

  handlePipelineChange(event: Event){
    const target =event.target as HTMLSelectElement;
    const value = +target.value;
    if(!value) return;
    this.store.selectPipeline(value);
    this.updateStageFields()
  }

  openPipelineSettingsModal(){
    this.isPipelineConfigModalVisible =true;
  }

  pipelineForm =this._fb.group({
    name: ['', [Validators.required]],
    maxNumberOfStages: [this.MAX_STAGES_COUNT]
  })

  dealCustomerForm =this._fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  dealForm =this._fb.group({
    name: ['', [Validators.required]],
    value: ['', [Validators.required]],
    contactName: ['', [Validators.required]],
    contactEmail: ['', [Validators.required]],
    contactPhone: ['', [Validators.required]] 
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

  addInputField(){
    if(this.stageFields.length >=(this.store.activePipeline()?.maxNumberOfStages ?? this.MAX_STAGES_COUNT) 
      || (this.stageFields.some(field =>!field.name || !field.progress) && this.stageFields.length) ) return

    this.stageFields.push({
      id: generateCryptCode(),
      name: '',
      progress: '',
      action: 'create',
      selected: true,
    })
  }

  async removeField(field:Field){
    if(this.stageFields.length <=1) return
    if(field.stageId){
        if(confirm(`Do you want to remove ${field.name}? This action cannot be undone!`)){
          await this.store.removeStage(field.stageId);
          this.updateStageFields()
        }
      
    }else{
      this.stageFields =this.stageFields.filter(
        field =>field.id !==field.id
      )
    }
  }

  handleFieldValueChange(payload:Field){
    const values =payload.progress.trim().split('%');
    const numerical =+(values.at(0) as string);
    this.stageFields[this.stageFields.indexOf(payload)] ={
      ...payload,
      progress: `${numerical >100? 100: numerical <0? 0: numerical}%`
    }
    this.stageFields =this.stageFields.map(field =>({
      ...field, selected: payload.id === field.id
    })) 
  }

  async submit(){
    const selectedField =this.stageFields.find(field =>field.selected);
    if(selectedField){
      const {name, progress, action, stageId} =selectedField;
      const values =progress.trim().split('%');
      const numerical =+(values.at(0) as string);
      if(name && progress){
        if(action === 'create'){
          await this.store.addNewStage({name, progress: numerical})
          this.updateStageFields();
        }
        else if (action =='edit'){
          const payload:any ={name, progress: numerical}
          if(this.store.activePipeline()?.stages.find(stage =>stage.name === name)) delete payload.name;
          await this.store.updateStage(payload, stageId as number);
          this.updateStageFields();
          return
        } 
      }

    }

    this.addInputField();
  }

  submitDealCustomer(){
    const values =this.dealCustomerForm.value as DealCustomerDto;
    if(this.dealCustomerForm.valid){
      this.dealForm.patchValue({
        contactName: values.name,
        contactEmail: values.email,
        contactPhone: values.phone,
      })
    }
    this.isContactFormVisible =false;
  }

  async submitDeal(){
    if(!this.dealForm.valid) return
    const customerDeal =this.dealForm.value as any as DealFormData;
    await this.store.addDeal(customerDeal);
    this.dealForm.reset();
    this.dealCustomerForm.reset()
    this.isDealFormModalVisible =false
  }

  setView(view:PipelineViews){
    this.store.setView(view)
  }

  showDealForm(){
    this.isDealFormModalVisible =true;
  }

  showContactForm(){
    this.isContactFormVisible =true;
  }

}
