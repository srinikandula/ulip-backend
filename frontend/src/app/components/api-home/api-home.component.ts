import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiKeys } from 'src/app/ApiKeys';
import { SideBarComponent } from './side-bar/side-bar.component';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import { MessageService } from 'primeng/api';
import {apiService} from "../../services/api/apiservice";


@Component({
  selector: 'app-api-home',
  templateUrl: './api-home.component.html',
  styleUrls: ['./api-home.component.css']
})
export class ApiHomeComponent implements OnInit {
handleOnEditKeyPressed(apikey: string) {
  this.router.navigate([`home/editkey/${apikey}`])
}
  onProgressSecKey: boolean = false;
  visibleSidebar(boolVal: boolean) {

    boolVal = true

  }
  addKeyCard(keyCard: ApiKeys) {

    this.apiHome.unshift(keyCard)

  }
  currectKeySelected: string = ""

  

  apiHome: ApiKeys[] = [];
  tokeVal: string = `${localStorage.getItem("authtoken")}`;
  isKeyEnable:boolean= true


  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService,
              private apiSrivice: apiService) {
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    // const body = {  };

    console.log(localStorage.getItem('authtoken'))

    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchKeys', {}, { headers }).subscribe({
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
  handleOnLogout() {
    localStorage.removeItem("authtoken")
    this.router.navigate(['login'])
  }
  handleOnCreate() {
    this.keypage.createKeyBool = true


  }
  handleOnMouseEnterRow(event:boolean){
    if(event){
      this.isKeyEnable = true
    }
    else{
      this.isKeyEnable = false
    }
  }
  handleOnMouseOutRow(){
    this.isKeyEnable = true
  }





}
