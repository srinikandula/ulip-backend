import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {apiService} from "../../services/api/apiservice";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = ""
  password: string = ""
  handleOnLogin() {
    console.log("cliccked")
    this.http.post<any>(this.apiSrivice.mainUrl + 'user/login', {
      "username": this.username,
      "password": this.password
    }).subscribe({
      next: data => {
        console.log(data)
        if(data.success){
          localStorage.setItem("ulip-person-name", data.user.name)
          localStorage.setItem("authtoken", data.authtoken)
          localStorage.setItem("ulip-person-username", data.user.username)
          this.router.navigate(['home/createkey'])
        }
      },
      error:error=>{
        console.error("There is an error", error.error.errors[0].msg)
        if (error.error.errors) {
          for (let i = 0; i < error.error.errors.length; ++i) {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: error.error.errors[i].msg })
          }
        }
      }
    })
    
  }
  constructor(private http: HttpClient, private router:Router, private apiSrivice: apiService, private messageService: MessageService) { }
  ngOnInit(): void {
    if(localStorage.getItem("authtoken")){
      this.router.navigate(['home/createkey'])
    }
  }
 
  




}
