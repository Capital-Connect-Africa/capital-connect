import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../../shared/routes/investor-dashboard-routes';
import { SidenavComponent } from '../../../../../core';
import { DealsPipelinesStore, PipelineViews } from '../../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DealPipeline, DealPipelineDto } from '../../../../deals-pipeline/interfaces/deal.pipeline.interface';
import { generateCryptCode } from '../../../../../core/utils/crypto.code.generator';
import { DealCustomerDto } from '../../../../deals-pipeline/interfaces/deal.customer.interface';
import { Deal, DealDto, DealFormData } from '../../../../deals-pipeline/interfaces/deal.interface';
import { ChildEventsService } from '../../../../deals-pipeline/services/child.events.service';
import { tap } from 'rxjs';
import { DealStatus } from '../../../../deals-pipeline/enums/deal.status.enum';
import { formatCurrency } from '../../../../../core/utils/format.currency';
import { fixNumber } from '../../../../../core/utils/fix-number.util';

interface Field {
  id: string, progress: string, name:string, stageId?:number, deals: number, action: 'edit' | 'create', selected:boolean
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


  stageFields:Field[] =[];
  links =INVESTOR_DASHBOARD_LINKS;
  store =inject(DealsPipelinesStore);
  private _childEventsService =inject(ChildEventsService);
  
  isInReadOnlyMode =false;
  isContactFormVisible =false;
  isPipelineFormVisible =false;
  isDealFormModalVisible =false;
  isPipelineInEditMode =false;
  isPipelineConfigModalVisible =false;

  onDealDragAndDrop$ =this._childEventsService.dealStageChange$.pipe(tap(() =>{
    this.updateStageFields();
  }))

  onNewDealSelected$ =this._childEventsService.dealSelected$.pipe(tap(mode =>{
    this.isInReadOnlyMode = mode == 'Read';
    this.isDealFormModalVisible =true
    this.updateDealFormsValues(this.store.currentlySelectedDeal() as Deal);
  }))

  onPipelineOpened$ =this._childEventsService.pipelineModalOpened$.pipe(tap(() =>{
    this.openPipelineSettingsModal();
  }))


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
          deals: stage.deals.length
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
    status: [DealStatus.ACTIVE],
    contactName: ['', [Validators.required]],
    contactEmail: ['', [Validators.required]],
    contactPhone: ['', [Validators.required]] 
  })

  async createNewPipeline(){
    const values =this.pipelineForm.value as Partial<DealPipelineDto>
    if(this.pipelineForm.invalid) return
    if(this.isPipelineInEditMode) await this.store.editPipeline(values);
    else await this.store.addNewPipeline(values);
    this.closePipelineForm();
  }

  closePipelineForm(){
    this.pipelineForm.reset();
    this.isPipelineInEditMode =false;
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
      deals: 0,
    })
  }

  async removeField(field:Field){
    if(this.stageFields.length <=1) return
    if(field.stageId){
        if(field.deals) return;
        if(confirm(`Do you want to remove ${field.name}? This action cannot be undone!`)){
          await this.store.removeStage(field.stageId);
          this.updateStageFields()
        }
      
    }else{
      this.stageFields =this.stageFields.filter(
        f =>f.id !== field.id
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
    this.store.setCurrentlySelectedDeal(undefined);
    this.isDealFormModalVisible =true;
  }

  showContactForm(){
    this.isContactFormVisible =true;
  }

  dealStatus:DealStatus[] =[]

  formatNumberValue(value: number){
    return formatCurrency(value)
  }

  parseFloatingValues(value: number){
    const [whole, float] =`${value}`.split('.')
    if(Number(float) >0) return value
    return Number(whole)
  }

  updateDealFormsValues(deal:Deal){
    if(!deal) return
    this.dealForm.patchValue({
      name: deal.name,
      value: `${fixNumber(Number(deal.value))}`,
      status: deal.status,
      contactName: deal.customer.name,
      contactEmail: deal.customer.email,
      contactPhone: deal.customer.phone,
    })
    this.dealCustomerForm.patchValue({
      name: deal.customer.name,
      email: deal.customer.email,
      phone: deal.customer.phone,
    })
    this.setOptions(deal.status === DealStatus.WON)
  }

  async resetSelectedDeal(){
    this.dealForm.reset();
    this.dealCustomerForm.reset();
    this.isContactFormVisible =false;
    this.store.setCurrentlySelectedDeal(undefined)
    this.setOptions()
  }

  switchToEditMode(){
    this.isInReadOnlyMode =false;
  }

  editPipelineName(){
    this.isPipelineFormVisible =true;
    this.isPipelineInEditMode =true;
    const pipeline =this.store.activePipeline() as DealPipeline;
    this.pipelineForm.patchValue({
      name: pipeline.name,
      maxNumberOfStages: pipeline.maxNumberOfStages
    })
  }

  async removePipeline(){
    const pipeline =this.store.activePipeline() as DealPipeline;
    if(!pipeline) return;
    if(confirm(`Do you want to remove ${pipeline.name}? This action cannot be undone`)){
      await this.store.removePipeline(pipeline.id);
      this.closePipelineForm();
      this.isPipelineConfigModalVisible =false;
    }
  }

  setOptions(isWon =false){
    if(!isWon) this.dealStatus =[DealStatus.ACTIVE, DealStatus.WON, DealStatus.LOST, DealStatus.CANCELLED]
    else this.dealStatus =[DealStatus.WON]
  }

  async updateDealStatus(event: Event, dealId:number){
    const target =event.target as HTMLSelectElement;
    const value =target.value as DealStatus;
    let payload:Partial<DealDto> ={status: value}
    if(value === DealStatus.WON) {
      const stages =this.store.activePipeline()?.stages ?? [];
      const wonStage =stages.find(stage =>stage.progress >=100);
      payload ={...payload, stageId: wonStage?.id}
    }
    await this.store.updateDeal(payload, dealId);
  }
}
