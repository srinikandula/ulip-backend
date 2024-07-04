import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiKeys } from 'src/app/ApiKeys';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import { MenuItem } from 'primeng/api';
import { apiService } from "../../../services/api/apiservice";
import { FormControl, FormGroup } from '@angular/forms';


interface selectInterface {
  name: string,
  code: string
}
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  formGroup!: FormGroup;
  handleOnUlipChange(e: any) {
    // console.log("changed")
    this.selectedUlipAccessUnOf = e.value
    console.log(this.selectedUlipAccessUnOf)
    
  }
  ulipAccess!: selectInterface[];

  selectedUlipAccess!: selectInterface[];
  selectedUlipAccessUnOf: selectInterface[] = [];

  selectedOption: string = '';
  onOptionChange(event: any) {
    this.selectedOption = event.target.value;
    console.log("This is ", this.selectedOption)
  }


  items: MenuItem[] | undefined;
  applicationName: string = "";
  ownerName: string = "";
  contactName: string = "";
  sidebarVisible2: boolean = false;
  emailAddress: string = "";
  myIp: string = ""
  position: string = "0.0.0.0";
  positionOptions = [
    {
      label: 'Allow access from anywhere',
      value: "0.0.0.0"
    },
    {
      label: 'Custom IP',
      value: "Custom"
    },
    {
      label: 'Current IP',
      value: "Current"
    }
  ];

  tokeVal: string = `${localStorage.getItem("authtoken")}`;



  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService, private apiSrivice: apiService) { }
  ngOnInit() {
    this.ulipAccess = [
      { name: 'VAHAN', code: '01' },
      { name: 'SARATHI', code: '02' },
      { name: 'FASTAG', code: '03' },
      { name: 'FOIS', code: '04' },
      { name: 'LDB', code: '05' },
      { name: 'ICEGATE', code: '06' },
      { name: 'EWAYBILL', code: '07' },
      { name: 'ECHALLAN', code: '08' },
      { name: 'DGFT', code: '09' },
      { name: 'PCS', code: '10' },
      { name: 'ACMES', code: '11' },
      { name: 'AACS', code: '12' },
      { name: 'AAICLAS', code: '13' },
      { name: 'DIGILOCKER', code: '14' },
      { name: 'FCI', code: '15' },
      { name: 'GATISHAKTI', code: '16' }
  
    ]
    

    // this.selectedUlipAccess = 

  }
  @Output() keyCardAdd: EventEmitter<ApiKeys> = new EventEmitter();

  generateApiKey(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    for (let i = 0; i < length; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return apiKey;
  }
  handleOnClickMenu() {
    console.log("close clicked")
    this.keypage.createKeyBool = false
  }
  handleOnCreateKey() {
    console.log(123)
    // this.keypage.createKeyBool = false
    const apiKey = self.crypto.randomUUID();
    let mySelectedString: string = '0000000000000000000000000000000'
    console.log("my selected is ", this.selectedUlipAccessUnOf)
    for (let i = 0; i < this.selectedUlipAccessUnOf.length; ++i) {

      let newStringArray = mySelectedString.split("");
      newStringArray[Number(this.selectedUlipAccessUnOf[i].code) - 1] = '1';
      mySelectedString = newStringArray.join("");

    }
    console.log("my selected string are: ", mySelectedString)
    const headers = new HttpHeaders({
      'auth-token': localStorage.getItem('authtoken') || '',
      'Content-Type': 'application/json'
    });
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      if (this.position === "Current") {
        this.myIp = res.ip
      }

      this.http.post<any>(this.apiSrivice.mainUrl + 'aping/createkey', {
        "key": apiKey,
        "ownerName": this.ownerName,
        "contactNo": this.contactName,
        "applicationName": this.applicationName,
        "email": this.emailAddress,
        "ip": this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}`,
        "ulipAccess": mySelectedString
      }, { headers }).subscribe({
        next: data => {
          // console.log(data)
          // const secKey  = this.handleOnGenSecKey(apiKey)
          const todoCard = {
            key: apiKey,
            ownerName: this.ownerName,
            contactNo: this.contactName,
            applicationName: this.applicationName,
            email: this.emailAddress,
            ip: this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}`,
            secKey: data.keyIs.secKey,
            ulipAccess: mySelectedString,
            updatedAt: "",
            active: true
          }


          this.messageService.add({ severity: 'success', summary: 'Key Created', detail: apiKey })
          this.keyCardAdd.emit(todoCard)

          this.http.post<any>(this.apiSrivice.mainUrl + 'aping/sendmailcreatekey', {
            "apiKey": apiKey,
            "ownerName": this.ownerName,
            "applicationName": this.applicationName,
            "email": this.emailAddress,
            "secretkey": data.keyIs.secKey
          }, { headers }).subscribe({
            next: data => {


              this.messageService.add({ severity: 'success', summary: 'Email Sent Successfully', detail: "" })


            },
            error: error => {
              console.error("There is an error", error)
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Mail Send failure" })
            }
          })
          this.applicationName = ''
          this.ownerName = ''
          this.contactName = ''
          this.emailAddress = ''
          this.positionOptions = [];
          this.keypage.createKeyBool = false;

        },
        error: error => {
          console.error("There is an error", error.error)
          if (error.error.errors) {
            for (let i = 0; i < error.error.errors.length; ++i) {
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: error.error.errors[i].msg })
            }
          }

        }
      })

    })




  }
  validateEmail(event: KeyboardEvent) {
    const input = event.key;
    if (/[0-9a-zA-Z@.]/.test(input)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  validateNumberAndChar(event: KeyboardEvent) {
    const input = event.key;
    // Regular expression to allow alphanumeric characters, @ symbol, dot, and dash
    if (/^[a-zA-Z0-9@.\-]*$/.test(input)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  validateNumber(event: KeyboardEvent) {
    const input = event.key;
    if (/[0-9]/.test(input)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
