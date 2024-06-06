import {Component, OnInit} from '@angular/core';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {apiService} from "../../services/api/apiservice";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit{
  dropdownList: any = [
    "VAHAN",  "SARATHI"
  ];
  selectedApiValue = [];
  dropdownSettingsForApiValue = {};
  requiredFieldForApiValues: boolean = false;
  selectedId: any;
   tokeVal: any;
  selectedVersionMap = new Map();
  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService,
              private apiSrivice: apiService) {
    this.tokeVal = localStorage.getItem('authtoken')
  }
  ngOnInit() {
    this.keypage.pageNav = 4
    this.dropdownSettingsForApiValue = {
      singleSelection: true,
      idField: 'id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.setStatusForApiValues();
  }


  onItemSelectForApiValues(item: any) {
    this.selectedId = item
    console.log(item)
    this.setClassForApiValues();
  }
  onSelectAllForApiValues(items: any) {
    this.setClassForApiValues();
  }
  setClassForApiValues() {
    this.setStatusForApiValues();
    if (this.selectedApiValue.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
  setStatusForApiValues() {
    (this.selectedApiValue.length > 0) ? this.requiredFieldForApiValues = true : this.requiredFieldForApiValues = false;
  }

  public files: any[] = [];

  // constructor(private _snackBar: MatSnackBar, public dialog: MatDialog){}


  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files) {
      const filesArray: File[] = Array.from(event.dataTransfer.files);
      this.onFileChange(filesArray);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }


  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const filesArray: File[] = Array.from(input.files);
      this.onFileChange(filesArray);
      input.value = '';
    }
  }

  onFileChange(pFileList: File[]): void {
    this.files = pFileList;
    let formData: FormData = new FormData();
    this.files.forEach(file => {
      formData.append('file', file);
    });

    let ind = this.selectedVersionMap.get(this.selectedId);
    let verNum: any = 0;
    if (ind < 9) {
      verNum += String(ind + 1);
    } else {
      verNum = String(ind + 1);
    }

    const myUrl = this.apiSrivice.mainUrl + 'aping/ulipxl/' + this.selectedId + "/" + '01';

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '',
      'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
      'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user': `${localStorage.getItem("ulip-person-username")}`
    });

    this.http.post<any>(myUrl, formData, { headers, responseType: 'blob' as 'json' }).subscribe((response) => {
      console.log(response, '------------------------------------');
      this.downloadFile(response);
      swal.fire('Success', 'Your Data will be Auto Downloaded!', 'success' );
      setTimeout( () => {
        formData = new FormData()
      }, 2000)
    }, error => {
      console.error('Error downloading file', error);
      if(error.status==400){
      swal.fire('Error', 'The uploaded file must contain a column named "vehiclenumber"', 'error' );
      }else{
        swal.fire('Error',error.message , 'error' );

      }
      // formData = new FormData();
      formData = new FormData()

    });
  }



  // onFileChange(pFileList: File[]){
    // console.log(pFileList)
    // @ts-ignore
    // this.files = Object.keys(pFileList).map(key => pFileList[key]);
    // this._snackBar.open("Successfully upload!", 'Close', {
    //   duration: 2000,
    // });
  // }

  deleteFile(f: any){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    // this._snackBar.open("Successfully delete!", 'Close', {
    //   duration: 2000,
    // });
  }

  // openConfirmDialog(pIndex): void {
  //   const dialogRef = this.dialog.open(DialogConfirmComponent, {
  //     panelClass: 'modal-xs'
  //   });
  //   dialogRef.componentInstance.fName = this.files[pIndex].name;
  //   dialogRef.componentInstance.fIndex = pIndex;
  //
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result !== undefined) {
  //       this.deleteFromArray(result);
  //     }
  //   });
  // }

  deleteFromArray(index: any) {
    console.log(this.files);
    this.files.splice(index, 1);
  }
  downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ulipResponeseData.xlsx'; // Set the desired file name with .xlsx extension for Excel files
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  downloadTemplateForVahan(){
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      { vehiclenumber: '' } // Creating header with empty cell
    ]);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VehicleNumberTemplate.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadTemplateForSatathi(){
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      { dlnumber: '',dob:''} // Creating header with empty cell
    ]);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SarathiTemplate.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
