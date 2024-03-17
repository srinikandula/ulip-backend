import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ApiKeys } from 'src/app/ApiKeys';
import { apiService } from 'src/app/services/api/apiservice';
import { KeypageService } from 'src/app/services/keypage/keypage.service';

@Component({
  selector: 'app-fetchulip',
  templateUrl: './fetchulip.component.html',
  styleUrls: ['./fetchulip.component.css']
})
export class FetchulipComponent implements OnInit {
handleOnApiChange(event: DropdownChangeEvent) {
  

}
handleOnSubmitRequest(){
  this.outputObjArr = []
  let ind = this.selectedVersionMap.get(this.selectedVersion)
  let verNum = '0'
  if(ind<9){
    verNum +=String(ind+1)
  }
  else{
    verNum = String(ind+1)
  }
  const myUrl = this.apiSrivice.mainUrl + 'aping/ulip/v1.0.0/'+this.selectedUlipArr+"/"+verNum;
  let ind2 = this.selectedUlipMap.get(this.selectedUlipArr)
  const myKeyArr = this.correctFetchArr[ind2].input[ind]
  
  let reqObj:any = {}
  if(myKeyArr.length === this.textInputUlip.length){
    for(let i = 0; i<myKeyArr.length; ++i){
      if(myKeyArr[i] === 'dob'){
        let mydate =new Date( this.textInputUlip[i])
        let mydateM= mydate.getMonth()
        let mydateMStr;
        if(mydateM<10){
          mydateMStr ="0"+ String(mydateM)
        }
        else{
          mydateMStr = String(mydateM)
        }

        let mydateD= mydate.getDate()
        let mydateDStr;
        if(mydateD<10){
          mydateDStr ="0"+ String(mydateD)
        }
        else{
          mydateDStr = String(mydateD)
        }
        let mystrDate = mydateDStr+"-"+mydateMStr+"-"+mydate.getFullYear()
        reqObj[myKeyArr[i]] = mystrDate
        continue
      }
      reqObj[myKeyArr[i]] = this.textInputUlip[i]
    }
  }
  else{
    this.messageService.add({ severity: 'error', summary: 'Submission Failed', detail: 'Plese Enter all the details' });
    return
  }
  
  let myseckey = ''
  for(let i = 0; i<this.apiData.length; ++i){
    if(this.apiData[i].key === this.selectedApiKeys){
      myseckey = this.apiData[i].secKey
      break
    }
  }
  if(myseckey.length === 0){
    this.messageService.add({ severity: 'error', summary: 'Submission Failed', detail: 'Plese Enter all the details' });
    return
  }
  const headers = new HttpHeaders({
    'auth-token': this.tokeVal || '', 
    'Content-Type': 'application/json',
    'api-key':`${this.selectedApiKeys}`,
    'seckey':myseckey
  });

  this.http.post<any>(myUrl, reqObj, { headers }).subscribe({
    next: data => {
      
    },
    error: error => {
      // console.error("There is an error", error.error)
      let allKeys = Object.keys(error.error)
      let allValues = Object.values(error.error)
      for(let i = 0; i<allKeys.length; ++i){
        let tempObj:{
          dt: string,
          vl: string
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]
        tempObj.vl = String(allValues[i]);
        this.outputObjArr.push(tempObj)
      }
    }
  })

  

}
  
  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService, private apiSrivice: apiService, private confirmationService: ConfirmationService){}
  apiData:ApiKeys[]= []

  handleOnUlipClick() {
    this.selectedVersion = ""
    this.versionUlip = []
    let ind = this.selectedUlipMap.get(this.selectedUlipArr)
    
    for (let i = 0; i < this.fetchArr[ind].use.length; ++i) {
      this.versionUlip.push(this.fetchArr[ind].use[i])
      this.selectedVersionMap.set(this.fetchArr[ind].use[i], i)
    }
  }
  handleOnVersionChange() {
    this.takeInputObjArr = []
    this.textInputUlip = []
    let ind = this.selectedVersionMap.get(this.selectedVersion)
    let ind2 = this.selectedUlipMap.get(this.selectedUlipArr)
    let len = this.fetchArr[ind2].input[ind].length
    for (let i = 0; i < len; ++i) {
      let obj = {
        dt: this.fetchArr[ind2].input[ind][i],
        vl: "empty"
      }
      this.takeInputObjArr.push(obj)
    }
  }
  // textInputUlip: string = ''

  value: string = "";
  takeInputObj: any;
  takeInputObjArr: {
    dt: string,
    vl: string
  }[] = [];

  outputObjArr: {
    dt: string,
    vl: string
  }[] = [];

  textInputUlip: string[] = new Array(this.takeInputObjArr.length).fill('');

  fetchArr: { ulip: string, use: Array<string>, input: Array<Array<string>> }[] = [
    {
      "ulip": "VAHAN",
      "use": ["Vehicle Data"],
      "input": [["Vehicle Number"]]
    },
    {
      "ulip": "SARATHI",
      "use": ["Driving License Data"],
      "input": [["DL Number", "Date of Birth"]]
    },
    {
      "ulip": "FOIS",
      "use": ["FOIS Information", "Travelling Details"],
      "input": [["FNR Number"], ["Station from", "Station To", "CMDT", "Wagon Type"]]
    },
    {
      "ulip": "FASTAG",
      "use": ["Tolls Information"],
      "input": [["Vehicle Number"]]
    },

  ]


  correctFetchArr: { ulip: string, use: Array<string>, input: Array<Array<string>> }[] = [
    {
      "ulip": "VAHAN",
      "use": ["Vehicle Data"],
      "input": [["vehiclenumber"]]
    },
    {
      "ulip": "SARATHI",
      "use": ["Driving License Data"],
      "input": [["dlnumber", "dob"]]
    },
    {
      "ulip": "FOIS",
      "use": ["FOIS Information", "Travelling Details"],
      "input": [["fnrnumber"], ["sttnfrom", "sttnto", "cmdt", "wgontype"]]
    },
    {
      "ulip": "FASTAG",
      "use": ["Tolls Information"],
      "input": [["vehiclenumber"]]
    },

  ]


  ulipArr: string[] = []
  selectedUlipMap = new Map();
  selectedVersionMap = new Map();

  selectedUlipArr: string | undefined

  versionUlip: string[] = []
  selectedVersion: string | undefined

  apiKeys: string[] = []
  selectedApiKeys: string | undefined

  tokeVal: string = `${localStorage.getItem("authtoken")}`;

  handleOnChangeInputs(i: any){
    
  }

  ngOnInit() {
    // this.apis = ['VAHAN', 'SARATHI', 'FOIS'];
    for (let i = 0; i < this.fetchArr.length; ++i) {
      let obj = {
        name: this.fetchArr[i].ulip,
        // code:String(i)
      }
      this.selectedUlipMap.set(this.fetchArr[i].ulip, i)
      this.ulipArr.push(this.fetchArr[i].ulip)
    }
  
  




    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });

    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchKeys', {}, { headers }).subscribe({
      next: data => {
        this.apiData = data.allKey
        for(let i = 0; i<data.allKey.length; ++i){
          if(data.allKey[i].active){
            this.apiKeys.push(data.allKey[i].key)

          }
        }
        

      },
      error: error => {
        console.error("There is an error", error)
      }
    })
    



    
  }

}
