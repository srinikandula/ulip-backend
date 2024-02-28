import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiKeys } from 'src/app/ApiKeys';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';




@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  applicationName: string = "";
  ownerName: string = "";
  contactName: string = "";
  sidebarVisible2: boolean = false;

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
    this.http.post<any>('http://localhost:5000/aping/createkey', {
      "key": apiKey,
      "ownerName": this.ownerName,
      "contactNo": this.contactName,
      "applicationName": this.applicationName
    }, { headers }).subscribe({
      next: data => {
        // console.log(data)
        const todoCard = {
          key: apiKey,
          ownerName: this.ownerName,
          contactNo: this.contactName,
          applicationName: this.applicationName,
          secKey: "",
          updatedAt: ""

        }
        this.messageService.add({ severity: 'success', summary: 'Key Created', detail: apiKey })
        this.keyCardAdd.emit(todoCard)

      },
      error: error => {
        console.error("There is an error", error)
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Please check your server" })
      }
    })
    this.keypage.createKeyBool = false
    // const templateParams = {
    //   usermail: "aksr2003@gmail.com",
    //   from_name: "MLL-ULIP",
    //   apiKey:apiKey,
    //   applicationName: this.applicationName,
    //   ownerName:this.ownerName
    // };
    emailjs.init("QuMxBAxGcl10ggVaf")
    emailjs.send('service_3ekbj9u', 'template_617bkto',{
        usermail: "aksr2003@gmail.com",
        from_name: "MLL-ULIP",
        apiKey: apiKey,
        applicationName: this.applicationName,
        ownerName: this.ownerName


      })

  }


}
