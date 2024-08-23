import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap, tap } from 'rxjs';
import { FeedbackService, UploadService } from '../../../core';
import { AuthStateService } from '../../auth/services/auth-state.service';
import { SectorsService } from '../../sectors/services/sectors/sectors.service';
import { Company, CompanyInput } from '../interfaces';
import { CompanyHttpService } from './company.service';
import { CompanyStateService } from './company-state.service';

@Injectable({ providedIn: 'root' })
export class OrganizationOnboardService {

  private _feedbackService = inject(FeedbackService);
  private _companyService = inject(CompanyHttpService)
  private _authStateService = inject(AuthStateService);
  private _uploadService = inject(UploadService);
  private _companyStateService = inject(CompanyStateService);
  private _sectorsService = inject(SectorsService);

  step1isValid = signal<boolean>(false);
  step2isValid = signal<boolean>(false);
  step3isValid = signal<boolean>(false);
  step4isValid = signal<boolean>(false);

  fetchSectors$ = this._sectorsService.getAllSectors();

  fetchSpecificSubSectors(sectorId: number) {
    return this._sectorsService.getSubSectorOfaSector(sectorId)
  }

  companyLogoToUpload = signal<File>(null as any);

  private _companyInput = signal<CompanyInput>({
    name: '',
    country: '',
    useOfFunds: [],
    fundsNeeded: 0,
    esgFocusAreas: [],
    businessSector: '',
    businessSubsector: '',
    productsAndServices: '',
    investmentStructure: [],
    registrationStructure: '',
    yearsOfOperation: "",
    growthStage: '',
    numberOfEmployees: '',
    fullTimeBusiness: false
  });

  companyInput$ = toObservable(this._companyInput)

  get companyInput() {
    return this._companyInput();
  }

  updateCompanyInput(update: Partial<CompanyInput>) {
    this._companyInput.set({
      ...this._companyInput(),
      ...update
    });
  }

  resetCompanyInput() {
    this._companyInput.set({
      name: '',
      country: '',
      useOfFunds: [],
      fundsNeeded: 0,
      esgFocusAreas: [],
      businessSector: '',
      businessSubsector: '',
      productsAndServices: '',
      investmentStructure: [],
      registrationStructure: '',
      yearsOfOperation: "",
      growthStage: '',
      numberOfEmployees: '',
      fullTimeBusiness: false
  })
}


  submitCompanyInfo(isEditMode: boolean, editId = 0) {

    const valToEdit = { ...this.companyInput, id: editId }
    //TODO: @pchessah Needs rework to check for image during updating
    const res$ = isEditMode && editId ? this._companyService.updateCompany(editId, valToEdit as Company) : this._companyService.createCompany(this.companyInput)
    return res$.pipe(
      switchMap(() => {
        if (this.companyLogoToUpload()) {
          const file = this.companyLogoToUpload()
          return this._uploadService.uploadFile(file)
        }
        return of(true) //Always return an observable to satisfy conditions of switchmap
      }),
      tap(() => {
        this.resetCompanyInput()
        this._feedbackService.success(isEditMode ? 'Company updated Successfully.' : 'Company created successfully.')
      }))
  }

  getCompanyOfUser() {
    const currentUserId = this._authStateService.currentUserId() && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId() : Number(sessionStorage.getItem('userId'));
    return this._companyService.getCompanyOfUser(currentUserId).pipe(tap(company => {
      this._companyInput.set(company);
      this._companyStateService.setCompany(company);
    }))
  }

  getCompanyToBeEdited(companyId: number) {
    return this._companyService.getSingleCompany(companyId).pipe(tap(c => {
      this.updateCompanyInput(c);
    }))
  }

}
