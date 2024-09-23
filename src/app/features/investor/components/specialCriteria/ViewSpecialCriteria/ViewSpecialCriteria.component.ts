import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfirmationService, FeedbackService, NavbarComponent } from '../../../../../core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomQuestion, SpecialCriteria } from '../../../../../shared/interfaces/Investor';
import { SpecialCriteriasService } from '../../../services/special-criteria.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSubmissionResponse } from '../../../../../shared';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionsService } from '../../../../questions/services/questions/questions.service';
import { AngularMaterialModule } from '../../../../../shared';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Company } from '../../../../organization/interfaces';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ConnectionRequestBody, InterestingBusinesses } from '../../../../../shared/interfaces';
import { BusinessAndInvestorMatchingService } from '../../../../../shared/business/services/busines.and.investor.matching.service';


@Component({
  standalone: true,
  selector: 'app-view-special-criteria',
  templateUrl: './ViewSpecialCriteria.component.html',
  styleUrls: ['./ViewSpecialCriteria.component.scss'],
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule, MultiSelectModule, ModalComponent, DropdownModule,AngularMaterialModule,
    RouterModule,TableModule
  ]
})
export class ViewSpecialCriteriaComponent implements OnInit {
  @Input() showBanner = false;
  //services
  sc = inject(SpecialCriteriasService)
  private _feedBackService = inject(FeedbackService);
  private _formBuilder = inject(FormBuilder);
  private _answer = inject(QuestionsService)
  private _confirmationService = inject(ConfirmationService);
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)


  //boolean
  update: boolean = false;
  addQuestions: boolean = false;
  add_custom_ques: boolean = false
  add_custom_answers: boolean = false
  multiple_answers: boolean = false
  updatePage: boolean = false
  back_btn:boolean = false
  addQues:boolean = false
  sc_comp: boolean = false
  decline: boolean = false;

  // Variables
  specialCriteriaId!: number;
  specialCriteria!: SpecialCriteria;
  specialCriteriaForm!: FormGroup;
  questionsForm!: FormGroup
  questionsRemoveForm!: FormGroup
  customQuestionsForm!: FormGroup
  customAnswersForm!: FormGroup
  SpecialCriteriaCompanies!: Company[]
  business__id!:number 
  declineReasons: String[] = [];
  declineForm!: FormGroup;
  interestingBusinesses: InterestingBusinesses[] = [];


  customQuestionResponse!: CustomQuestion
  questions!: UserSubmissionResponse[];
  question_types: string[] = ["MULTIPLE_CHOICE", "SINGLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]
  //streams
  addQuestions$!: Observable<unknown>;
  removeQuestions$!: Observable<unknown>;
  specialCriteriaId$!: Observable<number | null>;
  getSpecialCriteria$!: Observable<SpecialCriteria>;
  update$!: Observable<unknown>;
  addCustomQuestions$!: Observable<unknown>
  createAnwer$!: Observable<unknown>
  deleteConf$ = new Observable<boolean>();
  getSpecialCriteriaCompanies$ = new Observable<Company[]>
  markAsInteresting$ = new Observable<unknown>()
  cancelInterestWithCompany$ = new Observable<unknown>()

  questions$ = this.sc.getQuestions().pipe(tap(res => {
    this.questions = res
  }))

  declineReasons$ = this._businessMatchingService.getDeclineReasons().pipe(tap(reasons => {
    this.declineReasons = reasons
  }))

  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1,10).pipe(
    tap(res => {
      this.interestingBusinesses = res;
    })
  );

  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => {
        this._feedBackService.success('Company marked as interesting successfully.');
      })
    );
  }



  constructor(private route: ActivatedRoute,private fb: FormBuilder) {
    this.declineForm = this.fb.group({
      countriesOfInvestmentFocus: [[]],
    });

    this.specialCriteriaId$ = this.route.params.pipe(
      map(params => Number(params['id'])),
      tap(id => {
        this.specialCriteriaId = id;
        this.getSpecialCriteriaCompanies$ = this.sc.getSpecialCriteriaCompanies(this.specialCriteriaId).pipe(tap(res=>{
          this.SpecialCriteriaCompanies = res
        }))
        this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
          this.specialCriteria = res
        }))
      })
    );
  }

  ngOnInit() {
    this.customAnswersForm = this._formBuilder.group({
      text: ['', Validators.required],
      weight: ['', Validators.required],
    })

    this.customQuestionsForm = this._formBuilder.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      tooltip: ['', Validators.required],
      order: ['', Validators.required]
    })

    this.questionsForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.questionsRemoveForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.specialCriteriaForm = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  patchForm(): void {
    this.questionsForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.specialCriteriaForm.patchValue({
      title: this.specialCriteria.title,
      description: this.specialCriteria.description
    })
  }

  onUpdate() {
    this.update = true
    this.updatePage = true
    this.patchForm()
  }

  onAdd(){
    this.updatePage = true
    this.addQuestions = true
    this.back_btn = true
    this.addQues = true
  }

  scComp(){
    this.sc_comp= true
  }

  onAddQuestions() {
    this.addQuestions = true
    this.patchForm()
  }

  addCustomQues() {
    this.add_custom_ques = true
  }

  onCustomQuestionsSubmit() {
    if (this.customQuestionsForm) {
      const formData = this.customQuestionsForm.value

      this.addCustomQuestions$ = this.sc.addCustomQuestionsToSpecialCriteria(formData).pipe(tap(res => {
        this._feedBackService.success('Custom Question Added To Special Criteria Successfully')
        this.customQuestionResponse = res

        let body = {
          specialCriteriaId: this.specialCriteriaId,
          questionIds: [res.id]
        }

        this.addQuestions$ = this.sc.addQuestionsToSpecialCriteria(body).pipe(tap(res => {
        }))
        this.add_custom_answers = true
        this.customQuestionsForm.reset()


        if (this.customQuestionResponse.type == "MULTIPLE_CHOICE" || this.customQuestionResponse.type == "SINGLE_CHOICE") {
          this.multiple_answers = true
        } else if (formData.type == "SHORT_ANSWER") {
          this.customAnswersForm.patchValue({
            text: "OPEN",
          })
        }
      }))

    }
  }

  onCustomAnswersSubmit() {
    if (this.customAnswersForm) {
      const formData = this.customAnswersForm.value

      formData.questionId = this.customQuestionResponse.id
      this.createAnwer$ = this.sc.createAnswer(formData).pipe(tap(res => {
        this.customAnswersForm.reset();
        this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
          this.specialCriteria = res
        }))
        if (!this.multiple_answers) {
          this.add_custom_ques = false
          this.add_custom_answers = false
        }
      }));
    }
  }

  cancel() {
    this.updatePage = false
    this.back_btn = false
    this.addQues = false
  }

  onQuestionsSubmit() {
    if (this.questionsForm) {
      const formData = this.questionsForm.value
      let body = {
        specialCriteriaId: this.specialCriteriaId,
        questionIds: formData.questionIds
      }

      this.addQuestions$ = this.sc.addQuestionsToSpecialCriteria(body).pipe(tap(res => {
        this._feedBackService.success('Questions Added To Special Criteria Successfully')

        this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
          this.specialCriteria = res
        }))

        this.questionsForm.reset()
      }))

    }
  }

  onQuestionsRemove(id:number) {
    let body = {
      specialCriteriaId: this.specialCriteriaId,
      questionIds: [id]
    }

    this.deleteConf$ = this._confirmationService.confirm('Are you sure you want to delete this special criteria question?').pipe(tap(conf =>{
      if(conf){
        this.removeQuestions$ = this.sc.removeQuestionsFromSpecialCriteria(body).pipe(tap(res => {
          this._feedBackService.success('Questions Removed From Special Criteria Successfully')
    
          this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
            this.specialCriteria = res
          }))
    
          this.questionsRemoveForm.reset()  
        }))      
      }
    }))    
  }



  exportToCSV() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    worksheet.columns = [
      { header: 'Country', key: 'country', width: 20 },
      { header: 'Business Sector', key: 'businessSector', width: 20 },
      { header: 'Business Sub Sector', key: 'businessSubsector', width: 20 },
      { header: 'Growth Stage', key: 'growthStage', width: 20 }
    ];

    this.SpecialCriteriaCompanies.forEach(business => {
      worksheet.addRow(business);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      fs.saveAs(new Blob([buffer]), 'Special Criteria Companies.xlsx');
    });
  }


  openModal(businessId: number){
    this.business__id = businessId
    // this.decline = true
    this.cancelInterestWithCompany$ = this._businessMatchingService
    .cancelInterestWithCompany(businessId, []).pipe(
      tap(() => {
        this._feedBackService.success('Business Declined Successfully.');
        // this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));  

        this.declineForm.reset();
        this.declineForm.updateValueAndValidity();

        this.decline = false;
      })
    );

  }


  submit(){
    this.cancelInterest(this.business__id)
  }

  cancelInterest(businessId: number): void {   

    if (this.declineForm.valid) {
      const selectedReasons: string[] = this.declineForm.get('reasons')?.value;
      this.cancelInterestWithCompany$ = this._businessMatchingService
        .cancelInterestWithCompany(businessId, selectedReasons).pipe(
          tap(() => {
            this._feedBackService.success('Interest cancelled successfully.');
            // this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies(1, this.itemsPerPage).pipe(tap(res => {this.interestingBusinesses = res;}));  

            this.declineForm.reset();
            this.declineForm.updateValueAndValidity();

            this.decline = false;
          })
        );
    }

  }
  


  onSubmit() {
    if (this.specialCriteriaForm.valid) {
      const formData = this.specialCriteriaForm.value
      this.update$ = this.sc.updateSpecialCriteria(this.specialCriteria.id, formData).pipe(
        tap(res => {
          this._feedBackService.success('Special Criteria Updated Successfully')
          this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
            this.specialCriteria = res
          }))

          // this.update = false
        })
      )
    }

  }
}