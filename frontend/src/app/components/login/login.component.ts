import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {apiService} from "../../services/api/apiservice";
import {MessageService} from "primeng/api";
import swal from "sweetalert2";
import CryptoJS from "crypto-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = ""
  password: string = ""
  secretKey:any= "mllf3xpex2kPk";
  public displayModal: any = false;
  email: string = ""
  handleOnLogin() {
    if(this.username==''|| this.username==undefined){
      this.messageService.add({ severity: 'error', summary: 'Please Enter Username', detail: ""})
    }else if(this.password==''||this.password==undefined){
      this.messageService.add({ severity: 'error', summary: 'Please Enter Password', detail: ""})

    }
    else{
    console.log("cliccked")
    const encryptedPassword = CryptoJS.AES.encrypt(this.password, this.secretKey).toString();
    console.log("encryptedPassword------",encryptedPassword)
    this.http.post<any>(this.apiSrivice.mainUrl + 'user/login', {
      "username": this.username,
      "password": encryptedPassword
    }).subscribe({
      next: data => {
        console.log(data)
        if(data.success){
          localStorage.setItem("ulip-person-tokenId", data.user.tokenId)
          localStorage.setItem("authtoken", data.authtoken)
          localStorage.setItem("ulip-person-username", data.user.username)
          localStorage.setItem("roleId", data.user.roleId)
          localStorage.setItem("roleName", data.user.roleName)
          this.router.navigate(['home/createkey'])
          this.messageService.add({ severity: 'success', summary: 'Login Success', detail: ""})
        }
      },
      error:error=>{
        console.log (error,'-------------------errro')
        this.messageService.add({ severity: 'error', summary: error.error.message, detail: ""})
      }
    })
  }
  }
  constructor(private http: HttpClient, private router:Router, private apiSrivice: apiService, private messageService: MessageService) { }
  ngOnInit(): void {
    if(localStorage.getItem("authtoken")){
      this.router.navigate(['home/createkey'])
    }
  }

  forgotPassword(): void{
    this.displayModal = true;
    console.log(this.email,'------------------------')

  }


  forgot(data:any){
    console.log(data)
    this.http.post<any>(this.apiSrivice.mainUrl + 'user/forgotPassword', {
      "email": data,
    }).subscribe({
      next: data => {
        console.log(data,'--------dataa')
        this.messageService.add({ severity: 'success', summary: data.message, detail: ""})
      },
      error:error=>{
        console.log (error.error,'-------------------errro')
        this.messageService.add({ severity: 'error', summary: error.error.error, detail: ""})
      }
    })
  }

}
