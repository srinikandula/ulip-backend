import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {apiService} from "../../services/api/apiservice";
import swal from "sweetalert2";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private http: HttpClient, private router:Router, private apiSrivice: apiService){}
  handleOnSubmitSignup() {
    this.http.post<any>(this.apiSrivice.mainUrl + 'user/signup', {
      "username":this.username,
      "tokenId":this.tokenId,
      "password":this.password,
      "contactNo":this.contact,
      "email":this.email
    }).subscribe({
      next: data => {
        console.log(data)
        if (data.success) {
          localStorage.setItem("authtoken", data.authtoken)
          localStorage.setItem("ulip-person-tokenId", data.tokenId)
          localStorage.setItem("ulip-person-username", data.user.username)
          this.router.navigate(['home/createkey'])
        }
        swal.fire('Success', 'Thanks for creating the Account in ULIP! An Email will be sent to our Team for your Account Activation.', 'success' );
      },
      error: error => {
        console.error("There is an error", error.error.message)
        if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
          this.displayErrors(error.error.errors);
        } else {
          swal.fire('Error', 'Failed to signup. Please try again later.', 'error');
        }
      }
    })
  }
  displayErrors(errors: any[]): void {
    let errorMessage = '<ul style="text-align: left; padding-left: 20px; color: red">'; // Left-align with some padding
    errors.forEach(error => {
      errorMessage += `<li>${error.msg}</li>`;
    });
    errorMessage += '</ul>';
    swal.fire({
      title: 'Validation Errors',
      html: errorMessage,
      icon: 'error',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-html-container'
      }
    });
  }
  onKeyPress(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    const isDigit = /^[0-9]$/.test(inputChar);
    if (!isDigit) {
      event.preventDefault();
    }
  }

  tokenId: string = "";
  username: string = "";
  password: string = "";
  conPassword: string = "";
  email: string = "";
  contact: string = "";


}
