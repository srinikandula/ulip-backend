import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {apiService} from "../../services/api/apiservice";

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
          this.router.navigate(['home/createkey'])
        }
      },
      error:error=>{
        console.error("There is an error", error)
      }
    })
    
  }
  constructor(private http: HttpClient, private router:Router, private apiSrivice: apiService) { }
  ngOnInit(): void {
    if(localStorage.getItem("authtoken")){
      this.router.navigate(['home/createkey'])
    }
  }
 
  




}
