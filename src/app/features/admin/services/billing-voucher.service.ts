import { map } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Voucher, VoucherFormData } from "../../../shared/interfaces/voucher.interface";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class BillingVoucherService extends BaseHttpService{

    getBillingVouchers(page:number =1, limit:number =10){
        return this.read(`${BASE_URL}/vouchers?page=${page}&limit=${limit}`).pipe(map(res =>{
            return res as Voucher[]
        }))
    }

    getBillingVoucherByCode(code: string){
        return this.read(`${BASE_URL}/vouchers/code/${code}`).pipe(map((res:any) =>{
            return res as Voucher
        }))
    }

    getBillingVoucherById(id: number){
        return this.readById(`${BASE_URL}/vouchers`, id).pipe(map((res:any) =>{
            return res as Voucher;
        }))
    }

    updateBillingVoucher(voucher:Partial<VoucherFormData>, id: number){
        return this.update(`${BASE_URL}/vouchers`, id, voucher).pipe(map((res:any) =>{
            return res as Voucher;
        }))
    }

    removeBillingVoucher(id: number){
        return this.delete(`${BASE_URL}/vouchers`, id).pipe(map((res:any) =>{
            return 
        }))
    }

    generateVoucher(voucher:Partial<VoucherFormData>){
        return this.create(`${BASE_URL}/vouchers`, voucher).pipe(map((res:any) =>{
            return res as Voucher
        }))
    }

    updateVoucher(voucher:Partial<VoucherFormData>, voucherId:number){
        return this.update(`${BASE_URL}/vouchers`, voucherId, voucher).pipe(map((res:any) =>{
            return res as Voucher
        }))
    }
}