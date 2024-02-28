import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import { MenuItem } from 'primeng/api';
import { ApiLogs } from 'src/app/ApiLogs';
import * as XLSX from 'xlsx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Observable, filter } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-api-logs',
  templateUrl: './api-logs.component.html',
  styleUrls: ['./api-logs.component.css']
})
export class ApiLogsComponent implements OnInit {

  

  getApiLog(){
    

  }

visibleReq: boolean = false;
visibleRes: boolean = false;
// reqDataObjKey: any;
reqDataObj: any;
reqDataObjArr:{
  dt:string,
  vl:string
}[]= [];

resDataObj: any;
resDataObjArr:{
  dt:string,
  vl:string
}[]= [];


myTempReqArr:any;

showDialogReqData(myreqData:string) {
  this.reqDataObjArr = []
  this.visibleReq = true
  this.reqDataObj = JSON.parse(myreqData)
  for (let i = 0; i < Object.keys(this.reqDataObj).length; i++) {
    
    let obj = {
      dt: Object.keys(this.reqDataObj)[i],
      vl: `${Object.values(this.reqDataObj)[i]}`,
    }

    this.reqDataObjArr.push(obj)
  }
  console.log(this.reqDataObjArr)
  
}

showDialogResData(myresData:string) {
  this.resDataObjArr = []
  this.visibleRes = true
  this.resDataObj = JSON.parse(myresData)
  for (let i = 0; i < Object.keys(this.resDataObj).length; i++) {
    
    let obj = {
      dt: Object.keys(this.resDataObj)[i],
      vl: `${Object.values(this.resDataObj)[i]}`,
    }

    this.resDataObjArr.push(obj)
  }
  console.log(this.resDataObjArr)
  
}
  getColumns(data: any[]): string[] {
    const columns: string[] = [];
    data.forEach(row => {
      Object.keys(row).forEach(col => {
        if (!columns.includes(col)) {
          columns.push(col);
        }
      });
    });
    return columns;
  }

  handleOnDownloadFile() {
    const columns = this.getColumns(this.apiLogs);
    console.log(columns)
    const worksheet = XLSX.utils.json_to_sheet(this.apiLogs, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');

  }

  apiLogs: ApiLogs[] = [];
  apiLogsTemp:ApiLogs[] = [];
  tokeVal: string = `${localStorage.getItem("authtoken")}`;
  filterSearchvalue: string = "";
  apiMenuFilter: Boolean = false
  handleOnToggleApiMenu() {
    this.apiMenuFilter = !this.apiMenuFilter
  }

  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService, public websocketservice: WebsocketService) {


    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    // const body = {  };

    console.log(localStorage.getItem('authtoken'))

    this.http.post<any>('http://localhost:5000/aping/fetchLogs', {}, { headers }).subscribe({
      next: data => {
        console.log(data)

        this.apiLogs = data.allLogs
        this.apiLogsTemp = this.apiLogs

      },
      error: error => {
        console.error("There is an error", error)
      }
    })

  }

  selectedCategories: any[] = [];

  categories: any[] = [
    { name: 'APIs', key: 'A' },
    { name: 'Response Data', key: 'M' },
    { name: 'Time', key: 'P' },
    { name: 'Application Name', key: 'R' }
  ];

  convertDate(str: string){

    const t = new Date(Number(str))
    return t
  }


  ngOnInit() {

    this.keypage.pageNav = 1
    this.websocketservice.listen("testevent").subscribe((data)=>{
      console.log(data)
    })

    

  }

  api_filter_function_a(obj: ApiLogs){
    let tempstr = obj.ulip.toLowerCase()
    return tempstr.includes(this.filterSearchvalue.toLowerCase())
  }
  api_filter_function_r(obj: ApiLogs){
    let tempstr = obj.applicationName.toLowerCase()
    return tempstr.includes(this.filterSearchvalue.toLowerCase())
  }
  api_filter_function_m(obj: ApiLogs){
    const resDataJson = JSON.parse(obj.resData)
    return resDataJson.error === "true"?false:true
  }
  funcDateSort(a: ApiLogs,b: ApiLogs){
    
    let t1 = new Date(Number(a.time))
    let t2 = new Date(Number(b.time))
    return t1.getTime()-t2.getTime()

  }

  
  
  changeFilterChecks(){
    let cateMapFilter = new Map();

    for(let i = 0; i<this.selectedCategories.length; ++i){
      if(this.selectedCategories[i].key === 'A'){
        // this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
        // break;
        cateMapFilter.set("A", true)
      }
      if(this.selectedCategories[i].key === 'M'){
        // this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
        // break;
        cateMapFilter.set("M", true)
      }
      if(this.selectedCategories[i].key === 'P'){
        // this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
        // break;
        cateMapFilter.set("P", true)
      }
      if(this.selectedCategories[i].key === 'R'){
        // this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
        // break;
        cateMapFilter.set("R", true)
      }

      
    }

    if(cateMapFilter.has("A") && !cateMapFilter.has("R")){
      this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
    }
    else if(!cateMapFilter.has("A") && cateMapFilter.has("R")){
      // this.apiLogsTemp = this.apiLogsTemp.concat(this.apiLogs.filter(this.api_filter_function_r.bind(this)))
      this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_r.bind(this));
       

    }
    else if(cateMapFilter.has("A") && cateMapFilter.has("R")){
      this.apiLogsTemp = this.apiLogs.filter(this.api_filter_function_a.bind(this));
      this.apiLogsTemp = this.apiLogsTemp.concat(this.apiLogs.filter(this.api_filter_function_r.bind(this)))
    }
    else if(!cateMapFilter.has("A") && !cateMapFilter.has("R")){
      this.apiLogsTemp  = this.apiLogs
    }
    

    
    this.apiLogsTemp = this.apiLogsTemp.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    if(cateMapFilter.has("M")){
      this.apiLogsTemp = this.apiLogsTemp.filter(this.api_filter_function_m.bind(this));
    }
    if(cateMapFilter.has("P")){
      this.apiLogsTemp = this.apiLogsTemp.sort(this.funcDateSort);
    }

    
  }




}
