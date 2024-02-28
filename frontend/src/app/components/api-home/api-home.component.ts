import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiKeys } from 'src/app/ApiKeys';
import { SideBarComponent } from './side-bar/side-bar.component';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-api-home',
  templateUrl: './api-home.component.html',
  styleUrls: ['./api-home.component.css']
})
export class ApiHomeComponent implements OnInit {
  onProgressSecKey: boolean = false;
  visibleSidebar(boolVal: boolean) {

    boolVal = true

  }
  addKeyCard(keyCard: ApiKeys) {

    this.apiHome.unshift(keyCard)

  }
  currectKeySelected:string=""
  handleIfCurrentLoaded( keyVal: string): boolean {
    return keyVal === this.currectKeySelected;
}
  handleOnGenSecKey(keyVal: string) {
    this.onProgressSecKey = true
    this.currectKeySelected = keyVal

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    const body = {
      passKey: keyVal

    }

    this.http.put<any>('http://localhost:5000/aping/generateseckey', body, { headers }).subscribe({
      next: data => {
        console.log(data)
        navigator.clipboard.writeText(data.secKeyIs)
        this.messageService.add({ severity: 'success', summary: 'Secret key copied', detail: "Check your clipboard" })
        this.onProgressSecKey = false

      },
      error: error => {
        console.error("There is an error", error)
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Check your Server" })
      }
    })

  }

  apiHome: ApiKeys[] = [];
  tokeVal: string = `${localStorage.getItem("authtoken")}`;


  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService) {
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    // const body = {  };

    console.log(localStorage.getItem('authtoken'))

    this.http.post<any>('http://localhost:5000/aping/fetchKeys', {}, { headers }).subscribe({
      next: data => {
        console.log(data)

        this.apiHome = data.allKey
        // this.apiHome.sort(function(a,b){
        //   return new Date(b.updatedAt) - new Date(a.updatedAt);
        // });

      },
      error: error => {
        console.error("There is an error", error)
      }
    })

  }


  handleOnCopyClick(keyVal: string) {
    this.messageService.add({ severity: 'success', summary: 'Passkey copied', detail: keyVal })
    navigator.clipboard.writeText(keyVal)
  }

  ngOnInit() {
    this.keypage.pageNav = 0

    



  }
  handleOnLogout(){
    localStorage.removeItem("authtoken")
    this.router.navigate(['login'])
  }
  handleOnCreate() {
    this.keypage.createKeyBool = true
    

  }





}