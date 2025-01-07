import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Rule } from '../../../../../shared/interfaces/rule.interface';
import { OperatorOption, Operators, UserProperties, Voucher, VoucherFormRuleFields, VoucherType } from '../../../../../shared/interfaces/voucher.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";
import { Option } from '../../../../../shared/interfaces/options.interface';

@Component({
  selector: 'app-voucher-rules',
  standalone: true,
  imports: [CommonModule, MultiSelectModule, CalendarModule, DropdownModule, ModalComponent, ReactiveFormsModule, TimeAgoPipe],
  templateUrl: './voucher-rules.component.html',
  styleUrl: './voucher-rules.component.scss'
})

export class VoucherRulesComponent {

  @Input() voucher!:Voucher;
  voucherRules:Rule[] =[];
  operators:OperatorOption[] =[];
  operator:Operators | null =null;
  options:Option[] =[]
  VoucherPurchase =VoucherType;
  private _fb =inject(FormBuilder)
  helperText ="";
  heading ="New Constraint";
  visible =true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher'] && this.voucher?.users) {
      this.voucherRules = this.voucher.rules;
    }
    this.helperText =`Add a contraint to the voucher ${this.voucher.code}`
  }

  ruleForm =this._fb.group({
    userPropery: ['', [Validators.required]],
    description: ['', [Validators.required]],
    operator: ['', [Validators.required]],
    value: ['', [Validators.required]],
  })

  saveRule() {

  }

  showModal(){
    this.visible =true;
  }

  formFields:VoucherFormRuleFields[] =[
    {
      userPropertyName: 'Role',
      userPropertyValue: UserProperties.roles,
      operator: [{value: Operators.EQUAL_TO, label: 'User Is'}],
      valueType: 'select',
      options: [{value: 'user', label: 'Business'}, {value: 'investor', label: 'Investor'}]
    }
  ]

  handleUserPropertyChange(event:any){
    const { value } =event;
    if(value){
      const operators =this.formFields.find(field =>field.userPropertyValue ==value);
      if(operators){
        this.operators =operators.operator
        this.options =operators.options
      }else{
        this.options =[];
        this.operators =[]
      }
    }else{
      this.operators =[];
    }
  }

  handleOperatorChange(event: any){
    const { value } =event
    
    if(value){
      this.operator =value;
    }else{
      this.operator =null;
    } 
  }
}
