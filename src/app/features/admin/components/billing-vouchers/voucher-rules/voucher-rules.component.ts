import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Rule, RuleFormData } from '../../../../../shared/interfaces/rule.interface';
import { OperatorOption, Operators, UserProperties, Voucher, VoucherFormRuleFields, VoucherType } from '../../../../../shared/interfaces/voucher.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { TimeAgoPipe } from "../../../../../core/pipes/time-ago.pipe";
import { Option } from '../../../../../shared/interfaces/options.interface';
import { Observable, switchMap, tap } from 'rxjs';
import { RulesService } from '../../../services/rule.service';
import { BillingVoucherService } from '../../../services/billing-voucher.service';

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
  options:Option[] =[];
  VoucherPurchase =VoucherType;
  private _fb =inject(FormBuilder);
  helperText ="";
  heading ="New Constraint";
  visible =false;
  createRule$ =new Observable();
  updateVoucherRule$ =new Observable();
  private _rulesService =inject(RulesService);
  private _voucherService =inject(BillingVoucherService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucher'] && this.voucher?.users) {
      this.voucherRules = this.voucher.rules;
    }
    this.helperText =`Add a contraint to the voucher ${this.voucher.code}`
  }

  ruleForm =this._fb.group({
    userProperty: ['', [Validators.required]],
    description: ['', [Validators.required]],
    operator: ['', [Validators.required]],
    value: ['', [Validators.required]],
  })

  saveRule(){
    const values =this.ruleForm.value as Partial<RuleFormData>;
    this.createRule$ =this._rulesService.createRule(values).pipe(switchMap(rule =>{
      return this._voucherService.updateBillingVoucher({rules: [rule.id]}, this.voucher.id).pipe(tap(res =>{
        this.voucher =res;
        this.voucherRules =res.rules;
        this.ruleForm.reset();
        this.visible =false;
      }))
    }));
    }

  showModal(){
    this.visible =true;
  }

  formFields:VoucherFormRuleFields[] =[
    {
      userPropertyName: 'Role',
      userPropertyValue: UserProperties.ROLES,
      operator: [{value: Operators.EQUAL_TO, label: 'User Is'}],
      valueType: 'select',
      options: [{value: 'user', label: 'Business'}, {value: 'investor', label: 'Investor'}]
    },
    
    {
      userPropertyName: 'Referrer',
      userPropertyValue: UserProperties.REFERRED_BY,
      operator: [{value: Operators.EQUAL_TO, label: 'Users Referred By'}],
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
