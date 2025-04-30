import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
  ColDef,
  GridOptions,
  iconSetMaterial,
  GridApi,
  colorSchemeDarkBlue,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { read, utils, write } from 'xlsx';
import { FeedbackService } from '../../../../core';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'data-file-preview',
  standalone: true,
  imports: [ModalComponent, AgGridAngular, CommonModule, FormsModule],
  templateUrl: './data-file-preview.component.html',
  styleUrl: './data-file-preview.component.scss',
})
export class DataFilePreviewComponent {
  @Input() file: File | null = null;
  @Output() onUpload =new EventEmitter<PublicInvestor[]>()
  fileName = '';
  visible = false;
  upload$ = new Observable();
  records: PublicInvestor[] = [];
  tableRowsSize = 0;
  totalRecords = 0;
  missingRecords = 0;
  logs:{label: string, error: string}[] =[]
  overwrite:boolean =false;
  arrayCols =['countries',  'useOfFunds', 'esgFocusAreas', 
    'businessGrowthStages', 'investmentStructures', 'contactName', 
    'contactEmail', 'sectors', 'subSectors', 'investees' ]

  cols =[
    'name', 'type', 'minFunding', 'maxFunding',
    'fundingVehicle','website',
    'description', ...this.arrayCols
  ]

  private cdr = inject(ChangeDetectorRef);
  private _feedbackService = inject(FeedbackService);
  private _publicInvestorService = inject(PublicInvestorsRepositoryService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && changes['file'].currentValue) {
      this.file = changes['file'].currentValue;
      this.visible = true;
      this.fileName = this.file?.name ?? '';
      const fileType = this.fileName.split('.').pop()?.toLowerCase() as string;
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const data = e.target.result;
        this.parseFile(this.file as File, data);
      };
      if (['csv', 'json'].includes(fileType)) {
        fileReader.readAsText(this.file as File);
      } else if (['xlsx', 'xls'].includes(fileType)) {
        fileReader.readAsArrayBuffer(this.file as File);
      }
    }
  }

  reset() {
    this.file = null;
    this.records = [];
    this.fileName = '';
    this.visible = false;
    this.tableRowsSize =0;
    this.missingRecords =0;
    this.gridApi =null;
    this.logs =[]
    this.cdr.detectChanges();
  }

  gridApi: GridApi<PublicInvestor> | null = null;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withPart(colorSchemeDarkBlue)
    .withParams({
      iconSize: 18,
      headerTextColor: 'white',
      rowHoverColor: 'transparent',
      wrapperBorderRadius: '.5rem',
    });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    onStateUpdated: () => {
      this.updateCounts();
    },
    columnDefs: [
      { field: 'name' },
      { field: 'type' },
      { field: 'minFunding' },
      { field: 'maxFunding' },
      { field: 'countries' },
      { field: 'fundingVehicle' },
      { field: 'useOfFunds' },
      { field: 'esgFocusAreas' },
      { field: 'businessGrowthStages' },
      { field: 'investmentStructures' },
      { field: 'contactName' },
      { field: 'contactEmail' },
      { field: 'website' },
      { field: 'sectors' },
      { field: 'subSectors' },
      { field: 'investees' },
      { field: 'description' },
      {
        field: 'actions',
        cellRenderer: (params: any) => {
          const div = document.createElement('div');
          const deleteButton = document.createElement('button');
          div.classList.add('flex', 'items-center', 'gap-3');
          deleteButton.innerHTML = `
              <i class="pi pi-times text-xs font-light"></i>
              <span class="font-light">Remove</span>
            `;
          deleteButton.classList.add(
            'flex',
            'items-center',
            'gap-2',
            'text-rose-300',
            'hover:text-rose-500',
            'transition-all'
          );
          deleteButton.addEventListener('click', () =>
            params.context.componentParent.deleteRow(params)
          );
          div.appendChild(deleteButton);
          return div;
        },
        width: 100,
        editable: false,
        sortable: false,
        filter: false,
      },
    ] as ColDef[],
    defaultColDef: {
      filter: true,
      editable: true,
    } as ColDef,
  };

  parseFile(file: File, data: any) {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    switch (fileType) {
      // case 'csv':
      //   this.parseCSV(data);
      //   break;
      case 'json':
        this.parseJSON(data);
        break;
      case 'xlsx':
      case 'xls':
        this.parseExcel(data);
        break;
      default:
        return;
    }
  }

  parseCSV(data: string) {}

  parseJSON(data: any) {
    try {
      const jsonData = JSON.parse(data);
      if (Array.isArray(jsonData)) {
        const header =Object.keys(jsonData.at(0) ?? {});
        const missingColumns = this.cols.filter(col => !header.includes(col));
      if (missingColumns.length > 4) {
        this._feedbackService.error('Invalid file structure', 'Schema Error')
        return this.reset();
      }
        this.records = jsonData.map((record) =>
          this.convertArraysToStrings(record)
        );
      } else {
        this.reset();
        this._feedbackService.error(
          'Invalid JSON format. Expected an array of objects.',
          'Parse Error'
        );
      }
    } catch (error: any) {
      this.reset();
      this._feedbackService.error(
        error.message,
        'Parse Error'
      );
    }
  }

  parseExcel(data: any) {
    try {
      const workbook = read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as any;
      const missingColumns = this.cols.filter(col => !headers.includes(col));

      if (missingColumns.length > 4) {
        this._feedbackService.error('Invalid file structure', 'Schema Error')
        return this.reset();
      }
      this.records = jsonData
        .slice(1)
        .map((row: any) => {
          return headers.reduce((obj: any, header: string, index: number) => {
            obj[header] = row[index];
            return obj;
          }, {});
        })
        .map((record) => this.convertArraysToStrings(record));
    } catch (error: any) {
      this.reset();
      this._feedbackService.error(
        error.message,
        'Parse Error'
      );
    }
  }

  deleteRow(node: any) {
    this.gridApi?.applyTransaction({ remove: [node.data] });
    this.updateCounts();
  }

  updateCounts() {
    let missingCount = 0;
    const data =this.getGridData();
    this.tableRowsSize = data.length;
    data.forEach((v) => {
      this.cols.forEach((field) => {
        if (!v[field]) {
          missingCount++;
        }
      });
      if (['', undefined, null].includes(v)) missingCount++;
    });
    this.missingRecords =missingCount;
    this.cdr.detectChanges()
  }

  convertArraysToStrings(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(', ') : value,
      ])
    );
  }

  getGridData(): any[] {
    const rowData: any[] = [];
    this.gridApi?.forEachNode((node) => rowData.push(node.data));
    return rowData;
  }

  convertToJsonFile(data: any[]): Blob {
    const content =data.map(item =>{
      const itm:Partial<PublicInvestor> ={}
      this.arrayCols.forEach(col =>{
        if(item[col]) 
          itm[col as keyof PublicInvestor] =item[col].split(',')
      })
      const investorType =item.type;
      delete item.type;
      return {...item, ...itm, investorType}
    })
    const jsonString = JSON.stringify(content);
    return new Blob([jsonString], { type: 'application/json' });
  }


convertToExcelFile(data: any[]): Blob {
    const content = data.map(item => {
        const itm: Partial<PublicInvestor> = {};
        this.arrayCols.forEach(col => {
            if (item[col]) 
            itm[col as keyof PublicInvestor] = item[col].split(',');
        });
        const investorType = item.type;
        delete item.type;
        return { ...item, ...itm, investorType };
    });
    const worksheet =utils.json_to_sheet(content);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}


  submit() {
    const data = this.getGridData();
    const [name, ext] =this.fileName.split('.')
    const payload =this.convertToJsonFile(data);
    // switch(ext){
    //   case 'json':
    //     payload =this.convertToJsonFile(data)
    //     break
    //   case 'xlsx':
    //   case 'xls':
    //     payload =this.convertToExcelFile(data)
    //     break
    //   default:
    //     break
    // } 
    if(!payload) return this._feedbackService.warning('No file selected', 'Upload');
    
    const formData = new FormData();
    formData.append('overwrite', `${this.overwrite}`)
    formData.append('file', payload as Blob, `${name}.json`);
    this.upload$ = this._publicInvestorService.uploadInvestors(formData).pipe(
      tap((res) => {
        if(res.savedCount >0){
          this._feedbackService.success( `${res.message} ${res.savedCount} added`, 'Investors');
        }
        if(res.savedCount >0){
          this.reset();
        }
        if(res.savedInvestors.length){
          this.onUpload.emit(res.savedInvestors);
        }
        if(res.failedInvestors){
          this.logs =res.failedInvestors.map(investor =>{
            return {label: investor.investorData.name, error: investor.error} as {label: string, error: string}
          })
          this.records =res.failedInvestors.map(investor =>investor.investorData) as PublicInvestor[]
        }

      })
    );
  }
  clearLogs(){
    this.logs =[]
  }
}
