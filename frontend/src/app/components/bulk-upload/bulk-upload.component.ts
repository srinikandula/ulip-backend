import {Component, OnInit} from '@angular/core';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {apiService} from "../../services/api/apiservice";
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
  selectedPdiStatus = [];
  dropdownSettingsForPdi = {};
  requiredFieldForPdi: boolean = false;
  selectedId: any;
   tokeVal: any;
  selectedVersionMap = new Map();
  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService,
              private apiSrivice: apiService) {
    this.tokeVal = localStorage.getItem('authtoken')
  }
  ngOnInit() {
    this.keypage.pageNav = 4
    this.dropdownSettingsForPdi = {
      singleSelection: true,
      idField: 'id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.setStatusForPdi();
  }


  onItemSelectForPdi(item: any) {
    this.selectedId = item
    console.log(item)
    this.setClassForPdi();
  }
  onSelectAllForPdi(items: any) {
    this.setClassForPdi();
  }
  setClassForPdi() {
    this.setStatusForPdi();
    if (this.selectedPdiStatus.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
  setStatusForPdi() {
    (this.selectedPdiStatus.length > 0) ? this.requiredFieldForPdi = true : this.requiredFieldForPdi = false;
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
    console.log(event, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    const input = event.target as HTMLInputElement;
    console.log(input, '-----------iiiiiiiiiiiiiiiiiiii')
    if (input && input.files) {
      const filesArray: File[] = Array.from(input.files);
      this.onFileChange(filesArray);
    }
  }

  onFileChange(pFileList: File[]): void {
    console.log(pFileList, '-------------------Pfile');
    this.files = pFileList;
    console.log(this.files, '==============');

    const formData: FormData = new FormData();
    this.files.forEach(file => {
      formData.append('file', file);
    });

    console.log(formData, '------------------------formData');

    let ind = this.selectedVersionMap.get(this.selectedId);
    let verNum: any = 0;
    if (ind < 9) {
      verNum += String(ind + 1);
    } else {
      verNum = String(ind + 1);
    }

    const myUrl = this.apiSrivice.mainUrl + 'aping/ulipxl/' + this.selectedId + "/" + '01';
    console.log(myUrl, "-------------myUrl");

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '',
      'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
      'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user': `${localStorage.getItem("ulip-person-username")}`
    });

    this.http.post<any>(myUrl, formData, { headers, responseType: 'blob' as 'json' }).subscribe(response => {
      console.log(response, '------------------------------------');
      this.downloadFile(response);
    }, error => {
      console.error('Error downloading file', error);
      // alert('Error downloading file: ' + error.message);
    });

    // this._snackBar.open("Successfully upload!", 'Close', {
    //   duration: 2000,
    // });
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
    a.download = 'vehicleNumbersData.xlsx'; // Set the desired file name with .xlsx extension for Excel files
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  downloadTemplateForVahan(){
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      { Vehiclenumber: '' } // Creating header with empty cell
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
    a.download = 'Template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
