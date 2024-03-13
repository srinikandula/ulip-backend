import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiKeys } from 'src/app/ApiKeys';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  backUrl:string = "http://ulipapi.mlldev.com"
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



  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService) { }
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
    const apiKey = self.crypto.randomUUID();
    const headers = new HttpHeaders({
      'auth-token': localStorage.getItem('authtoken') || '',
      'Content-Type': 'application/json'
    });
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      if (this.position === "Current") {
        this.myIp = res.ip

      }

      this.http.post<any>(`${this.backUrl}/aping/createkey`, {
        "key": apiKey,
        "ownerName": this.ownerName,
        "contactNo": this.contactName,
        "applicationName": this.applicationName,
        "email": this.emailAddress,
        "ip": this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}`
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
            updatedAt: "",


          }


          this.messageService.add({ severity: 'success', summary: 'Key Created', detail: apiKey })
          this.keyCardAdd.emit(todoCard)

          this.http.post<any>(`${this.backUrl}/aping/sendmailcreatekey`, {
            "apiKey": apiKey,
            "ownerName": this.ownerName,
            "applicationName": this.applicationName,
            "email": this.emailAddress
          }, { headers }).subscribe({
            next: data => {


              this.messageService.add({ severity: 'success', summary: 'Email Sent Successfully', detail: "" })
              

            },
            error: error => {
              console.error("There is an error", error)
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Mail Send failure" })
            }
          })

        },
        error: error => {
          console.error("There is an error", error)
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Please check your server" })
        }
      })

    })



    
  }



}
