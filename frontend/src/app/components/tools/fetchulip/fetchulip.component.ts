import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ApiKeys } from 'src/app/ApiKeys';
import { apiService } from 'src/app/services/api/apiservice';
import { KeypageService } from 'src/app/services/keypage/keypage.service';

interface MyObject {
  [key: string]: any;
}
@Component({
  selector: 'app-fetchulip',
  templateUrl: './fetchulip.component.html',
  styleUrls: ['./fetchulip.component.css']
})
export class FetchulipComponent implements OnInit {
  refineVahan() {
    console.log("insdie teh refinement")
    for (let i = 0; i < this.outputObjCompleteArr.length; ++i) {
      if (this.outputObjCompleteArr[i].length > 0 && typeof this.outputObjCompleteArr[i][0].vl === 'object') {
        console.log("Insidd teh if 1")
        if (this.outputObjCompleteArr[i][0].vl._text) {
          console.log("Insidd teh if 2")
          this.outputObjCompleteArr[i][0].vl = this.outputObjCompleteArr[i][0].vl._text
        }
      }
    }
  }
  handleOnSubmitRequest() {
    this.outputObjArr = []
    let ind = this.selectedVersionMap.get(this.selectedVersion)
    let verNum = '0'
    if (ind < 9) {
      verNum += String(ind + 1)
    }
    else {
      verNum = String(ind + 1)
    }
    const myUrl = this.apiSrivice.mainUrl + 'aping/ulipui/' + this.selectedUlipArr + "/" + verNum;
    let ind2 = this.selectedUlipMap.get(this.selectedUlipArr)
    const myKeyArr = this.correctFetchArr[ind2].input[ind]

    let reqObj: any = {}
    if (myKeyArr.length === this.textInputUlip.length) {
      for (let i = 0; i < myKeyArr.length; ++i) {
        if (myKeyArr[i] === 'dob') {
          let mydate = new Date(this.textInputUlip[i])
          let mydateM = mydate.getMonth()
          let mydateMStr;
          if (mydateM < 10) {
            mydateMStr = "0" + String(mydateM)
          }
          else {
            mydateMStr = String(mydateM)
          }

          let mydateD = mydate.getDate()
          let mydateDStr;
          if (mydateD < 10) {
            mydateDStr = "0" + String(mydateD)
          }
          else {
            mydateDStr = String(mydateD)
          }
          let mystrDate = mydate.getFullYear() + "-" + mydateMStr + "-" + mydateDStr
          reqObj[myKeyArr[i]] = mystrDate
          continue
        }
        reqObj[myKeyArr[i]] = this.textInputUlip[i]
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Submission Failed', detail: 'Plese Enter all the details' });
      return
    }


    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', 
      'Content-Type': 'application/json',
      'api-key':"16f78afa-e306-424e-8a08-21ad21629404",
      'seckey':"f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user':`${localStorage.getItem("ulip-person-username")}`
    });

    this.http.post<any>(myUrl, reqObj, { headers }).subscribe({
      next: data => {
        let mydata = data.json;
    // if(this.selectedUlipArr === "VAHAN"){
    //  mydata = data.json
    // }
    // else{
    //   mydata = data.json.response.json

    // }

    if (this.selectedUlipArr === "VAHAN") {
      let allKeys = Object.keys(mydata)

      let allValues = Object.values(mydata)
      let tempObjArrOutput: Array<{
        dt: string,
        vl: any
      }> = []
      let tempArray: Array<{
        dt: string,
        vl: any
      }> = []
      for (let i = 0; i < allKeys.length; ++i) {
        let tempObj: {
          dt: string,
          vl: any
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]
        console.log("Insdie teh loop")
        if (typeof allValues[i] === 'object') {
          let objArrKeys = Object.keys(Object(allValues[i]))
          let objArrVal = Object.values(Object(allValues[i]));
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          this.outputObjCompleteArr.push(tempObjArrOutput)
          tempObjArrOutput = []
        }
        else {
          while (i < allKeys.length && typeof allValues[i] !== 'object') {
            let veryVeryTempObj = {
              dt: allKeys[i],
              vl: allValues[i]
            }
            tempArray.push(veryVeryTempObj)
            i++;
          }
          i--;

          this.outputObjCompleteArr.push(tempArray)
          tempArray = []
        }

      }
      this.refineVahan()
      console.log("MY complete array ", this.outputObjCompleteArr)

    }
    else if (this.selectedUlipArr === "SARATHI") {
      this.outputObjCompleteArr = []
      // console.log("My data is ", mydata.json.response[0].response.dldetobj[0])
      let mydata2 = mydata.response[0].response.dldetobj[0]

      let allKeys = Object.keys(mydata2)
      this.tableOutputHeader = allKeys
      let allValues = Object.values(mydata2)
      let tempObjArrOutput: Array<{
        dt: string,
        vl: any
      }> = []
      let tempArray: Array<{
        dt: string,
        vl: any
      }> = []
      for (let i = 0; i < allKeys.length; ++i) {
        let tempObj: {
          dt: string,
          vl: any
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]
        console.log("The type of is ", Array.isArray(allValues[i]))
        if (typeof allValues[i] === 'object' && !Array.isArray(allValues[i])) {
          // let tempObjVal:any = allValues[i]
          let objArrKeys = Object.keys(Object(allValues[i]))
          let objArrVal = Object.values(Object(allValues[i]));
          console.log("inside teh if")
          console.log("Objarrkeys ",allValues[i])
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          this.outputObjCompleteArr.push(tempObjArrOutput)
          tempObjArrOutput = []
        }
        else if (typeof allValues[i] === 'object' && Array.isArray(allValues[i]) && allValues[i] !== null && allValues[i] !== undefined) {
          // let tempObjVal:any = allValues[i]let objArrKeys = Object.keys(allValues[i][0] as Record<string, any>);
          let val_arr = allValues[i] as any[]
          let objArrKeys = Object.keys(Object(val_arr[0]));
          let objArrVal = Object.values(Object(val_arr[0]));
          console.log("inside teh if")
          console.log("Objarrkeys ",allValues[i])
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          this.outputObjCompleteArr.push(tempObjArrOutput)
          tempObjArrOutput = []
        }
        else if(!Array.isArray(allValues[i])) {
          console.log("Inside the else if ")
          while (i < allKeys.length && typeof allValues[i] !== 'object') {
            let veryVeryTempObj = {
              dt: allKeys[i],
              vl: allValues[i]
            }
            tempArray.push(veryVeryTempObj)
            i++;
          }
          i--;

          this.outputObjCompleteArr.push(tempArray)
          tempArray = []
        }
        console.log("my sarathi output ", this.outputObjCompleteArr)

      }

    }
    else if (this.selectedUlipArr === "FOIS") {
      this.outputObjCompleteArr = []
      let mydata2 = mydata.response[0].response[0]
      let allKeys = Object.keys(mydata2)

      let allValues = Object.values(mydata2)
      let tempObjArrOutput: Array<{
        dt: string,
        vl: any
      }> = []
      let tempArray: Array<{
        dt: string,
        vl: any
      }> = []
      for (let i = 0; i < allKeys.length; ++i) {
        let tempObj: {
          dt: string,
          vl: any
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]

        if (typeof allValues[i] === 'object') {
          let objArrKeys = Object.keys(Object(allValues[i]))
          let objArrVal = Object.values(Object(allValues[i]));
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          this.outputObjCompleteArr.push(tempObjArrOutput)
          tempObjArrOutput = []
        }
        else {
          while (i < allKeys.length && typeof allValues[i] !== 'object') {
            let veryVeryTempObj = {
              dt: allKeys[i],
              vl: allValues[i]
            }
            tempArray.push(veryVeryTempObj)
            i++;
          }
          i--;

          this.outputObjCompleteArr.push(tempArray)
          tempArray = []
        }

      }



    }
    else if (this.selectedUlipArr === "LDB") {

      this.handleLDB1(mydata)
      this.handleLDB2(mydata)



    }



      },
      error: error => {

        let allKeys = Object.keys(error.error)
        let allValues = Object.values(error.error)
        for(let i = 0; i<allKeys.length; ++i){
          let tempObj:{
            dt: string,
            vl: any
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

  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService, private apiSrivice: apiService, private confirmationService: ConfirmationService) { }
  
    apiData: ApiKeys[] = []
    tableOutputHeader: string[] = []

    handleOnUlipClick() {
      this.versionUlip = []
      let ind = this.selectedUlipMap.get(this.selectedUlipArr)
      this.selectedVersion = this.fetchArr[ind].use[0]

      for (let i = 0; i < this.fetchArr[ind].use.length; ++i) {
        this.versionUlip.push(this.fetchArr[ind].use[i])
        this.selectedVersionMap.set(this.fetchArr[ind].use[i], i)
      }
      this.handleOnVersionChange()
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
    } [] = [];

    outputObjArr: {
      dt: string,
        vl: any
    } [] = [];
    outputObjCompleteArr: Array<Array<{
      dt: string,
      vl: any
    }>> = [];
    outputObjCompleteArrLDB1: Array<Array<Array<{
      dt: string,
      vl: any
    }>>> = [];
    outputObjCompleteArrLDB2: Array<Array<Array<{
      dt: string,
      vl: any
    }>>> = [];

    textInputUlip: string[] = new Array(this.takeInputObjArr.length).fill('');

    fetchArr: { ulip: string, use: Array<string>, input: Array<Array<string>> } [] = [
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
        "ulip": "LDB",
        "use": ["Track Container"],
        "input": [["Container Number"]]
      },

    ]


    correctFetchArr: { ulip: string, use: Array<string>, input: Array<Array<string>> } [] = [
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
        "ulip": "LDB",
        "use": ["Track Container"],
        "input": [["containerNumber"]]
      },

    ]


    ulipArr: string[] = []
    selectedUlipMap = new Map();
    selectedVersionMap = new Map();

    selectedUlipArr: string | undefined

    versionUlip: string[] = []
    selectedVersion: string | undefined
    tokeVal: string = `${localStorage.getItem("authtoken")}`;

    handleOnChangeInputs(i: any) {

    }

    ngOnInit() {
      this.keypage.pageNav = 2
      // this.apis = ['VAHAN', 'SARATHI', 'FOIS'];
      for (let i = 0; i < this.fetchArr.length; ++i) {
        let obj = {
          name: this.fetchArr[i].ulip,
          // code:String(i)
        }
        this.selectedUlipMap.set(this.fetchArr[i].ulip, i)
        this.ulipArr.push(this.fetchArr[i].ulip)
      }
    }

    handleLDB1(mydata:any) {
      this.outputObjCompleteArrLDB1 = []
      // console.log("My data is ", mydata.json.response[0].response.dldetobj[0])
      let mydata2 = mydata.response[0].response.eximContainerTrail
  
      let allKeys = Object.keys(mydata2)
      this.tableOutputHeader = allKeys
      let allValues = Object.values(mydata2)
      let tempObjArrOutput: Array<{
        dt: string,
        vl: any
      }> = []
      let tempArray: Array<{
        dt: string,
        vl: any
      }> = []
      for (let i = 0; i < allKeys.length; ++i) {
        let tempObj: {
          dt: string,
          vl: any
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]
        console.log("The type of is ", Array.isArray(allValues[i]))
        if (typeof allValues[i] === 'object' && !Array.isArray(allValues[i])) {
          // let tempObjVal:any = allValues[i]
          let objArrKeys = Object.keys(Object(allValues[i]))
          let objArrVal = Object.values(Object(allValues[i]));
          console.log("inside teh if")
          console.log("Objarrkeys ", allValues[i])
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          let ldbTempArrOutput: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          ldbTempArrOutput.push(tempObjArrOutput)
          this.outputObjCompleteArrLDB1.push(ldbTempArrOutput)
          tempObjArrOutput = []
        }
        else if (typeof allValues[i] === 'object' && Array.isArray(allValues[i]) && allValues[i] !== null && allValues[i] !== undefined) {
          // let tempObjVal:any = allValues[i]let objArrKeys = Object.keys(allValues[i][0] as Record<string, any>);
          let val_arr = allValues[i] as any[]
          let tempObjArrOutputArr: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          for (let i = 0; i < val_arr.length; ++i) {
            let objArrKeys = Object.keys(Object(val_arr[i]));
            let objArrVal = Object.values(Object(val_arr[i]));
            console.log("inside teh if")
            console.log("Objarrkeys ", allValues[i])
            for (let i = 0; i < objArrKeys.length; ++i) {
              let veryVeryTempObj = {
                dt: objArrKeys[i],
                vl: objArrVal[i]
              }
              tempObjArrOutput.push(veryVeryTempObj)
            }
            tempObjArrOutputArr.push(tempObjArrOutput)
            tempObjArrOutput = []
          }
          this.outputObjCompleteArrLDB1.push(tempObjArrOutputArr)
          tempObjArrOutputArr = []
  
        }
        else if (!Array.isArray(allValues[i])) {
          while (i < allKeys.length && typeof allValues[i] !== 'object') {
            let veryVeryTempObj = {
              dt: allKeys[i],
              vl: allValues[i]
            }
            tempArray.push(veryVeryTempObj)
            i++;
          }
          i--;
          let ldbTempArr: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          ldbTempArr.push(tempArray)
  
          this.outputObjCompleteArrLDB1.push(ldbTempArr)
          tempArray = []
          ldbTempArr = []
        }
      }
    }

    handleLDB2(mydata:any) {
      this.outputObjCompleteArrLDB2 = []
      // console.log("My data is ", mydata.json.response[0].response.dldetobj[0])
      let mydata2 = mydata.response[0].response.domesticContainerTrail
  
      let allKeys = Object.keys(mydata2)
      this.tableOutputHeader = allKeys
      let allValues = Object.values(mydata2)
      let tempObjArrOutput: Array<{
        dt: string,
        vl: any
      }> = []
      let tempArray: Array<{
        dt: string,
        vl: any
      }> = []
      for (let i = 0; i < allKeys.length; ++i) {
        let tempObj: {
          dt: string,
          vl: any
        } = {
          dt: '',
          vl: ''
        }
        tempObj.dt = allKeys[i]
        console.log("The type of is ", Array.isArray(allValues[i]))
        if (typeof allValues[i] === 'object' && !Array.isArray(allValues[i])) {
          // let tempObjVal:any = allValues[i]
          let objArrKeys = Object.keys(Object(allValues[i]))
          let objArrVal = Object.values(Object(allValues[i]));
          console.log("inside teh if")
          console.log("Objarrkeys ", allValues[i])
          for (let i = 0; i < objArrKeys.length; ++i) {
            let veryVeryTempObj = {
              dt: objArrKeys[i],
              vl: objArrVal[i]
            }
            tempObjArrOutput.push(veryVeryTempObj)
          }
          let ldbTempArrOutput: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          ldbTempArrOutput.push(tempObjArrOutput)
          this.outputObjCompleteArrLDB2.push(ldbTempArrOutput)
          tempObjArrOutput = []
        }
        else if (typeof allValues[i] === 'object' && Array.isArray(allValues[i]) && allValues[i] !== null && allValues[i] !== undefined) {
          // let tempObjVal:any = allValues[i]let objArrKeys = Object.keys(allValues[i][0] as Record<string, any>);
          let val_arr = allValues[i] as any[]
          let tempObjArrOutputArr: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          for (let i = 0; i < val_arr.length; ++i) {
            let objArrKeys = Object.keys(Object(val_arr[i]));
            let objArrVal = Object.values(Object(val_arr[i]));
            console.log("inside teh if")
            console.log("Objarrkeys ", allValues[i])
            for (let i = 0; i < objArrKeys.length; ++i) {
              let veryVeryTempObj = {
                dt: objArrKeys[i],
                vl: objArrVal[i]
              }
              tempObjArrOutput.push(veryVeryTempObj)
            }
            tempObjArrOutputArr.push(tempObjArrOutput)
            tempObjArrOutput = []
          }
          this.outputObjCompleteArrLDB2.push(tempObjArrOutputArr)
          tempObjArrOutputArr = []
  
        }
        else if (!Array.isArray(allValues[i])) {
          while (i < allKeys.length && typeof allValues[i] !== 'object') {
            let veryVeryTempObj = {
              dt: allKeys[i],
              vl: allValues[i]
            }
            tempArray.push(veryVeryTempObj)
            i++;
          }
          i--;
          let ldbTempArr: Array<Array<{
            dt: string,
            vl: any
          }>> = []
          ldbTempArr.push(tempArray)
  
          this.outputObjCompleteArrLDB2.push(ldbTempArr)
          tempArray = []
          ldbTempArr = []
        }
      }
    }

  }

  
