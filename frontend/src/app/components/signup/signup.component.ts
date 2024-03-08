import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private http: HttpClient, private router:Router){}
  handleOnSubmitSignup() {
    this.http.post<any>('http://localhost:5000/user/signup', {
      "username":this.username,
      "name":this.name,
      "password":this.password,
      "contactNo":this.contact,
      "email":this.email
    }).subscribe({
      next: data => {
        console.log(data)
        if (data.success) {
          localStorage.setItem("authtoken", data.authtoken)
          this.router.navigate(['home/createkey'])
        }
      },
      error: error => {
        console.error("There is an error", error)
      }
    })
  }
  name: string = "";
  username: string = "";
  password: string = "";
  conPassword: string = "";
  email: string = "";
  contact: string = "";


}
