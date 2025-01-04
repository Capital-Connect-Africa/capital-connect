import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Rule } from '../../../../../shared/interfaces/rule.interface';
import { Voucher, VoucherType } from '../../../../../shared/interfaces/voucher.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-voucher-rules',
  standalone: true,
  imports: [CommonModule, MultiSelectModule, CalendarModule, DropdownModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './voucher-rules.component.html',
  styleUrl: './voucher-rules.component.scss'
})

export class VoucherRulesComponent {

  @Input() voucher!:Voucher;
  voucherRules:Rule[] =[];
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
}
