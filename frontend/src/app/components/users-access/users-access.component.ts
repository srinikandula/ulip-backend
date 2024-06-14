import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {KeypageService} from "../../services/keypage/keypage.service";
import {MessageService} from "primeng/api";
import {apiService} from "../../services/api/apiservice";
import Swal from "sweetalert2";
import swal from "sweetalert2";

@Component({
  selector: 'app-users-access',
  templateUrl: './users-access.component.html',
  styleUrls: ['./users-access.component.css']
})
export class UsersAccessComponent implements OnInit {
  public tokeVal: any;
  public getAllUserListData: any[] = [];
  public filteredUsers: any[] = [];
  public searchTerm: string = '';
  public page: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    public keypage: KeypageService,
    private messageService: MessageService,
    private apiSrivice: apiService
  ) {
    this.tokeVal = localStorage.getItem('authtoken');
  }

  ngOnInit() {
    this.keypage.pageNav = 5;
    this.getAllUsers();
  }

  getAllUsers(): void {
    const getAllUserUrl = this.apiSrivice.mainUrl + 'user/getUserData';
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '',
      'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
      'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user': `${localStorage.getItem("ulip-person-username")}`
    });

    this.http.get<any>(getAllUserUrl, { headers }).subscribe((response) => {
      if (response) {
        this.getAllUserListData = response.userData;
        this.filteredUsers = this.getAllUserListData;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.getAllUserListData;
    } else {
      this.filteredUsers = this.getAllUserListData.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.tokenId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.contactNo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.roleName && user.roleName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.status && user.status.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  active(userData: any): void {
    const getAllUserUrl = this.apiSrivice.mainUrl + 'user/access';
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '',
      'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
      'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user': `${localStorage.getItem("ulip-person-username")}`
    });

    Swal.fire({
      title: "Are you sure?",
      html: "You want to activate <b>" + userData.username + "</b>!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, Activate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post<any>(getAllUserUrl, { username: userData.username, status: 'Active' }, { headers }).subscribe((response) => {
          if (response) {
            Swal.fire({
              title: "Activated!",
              text: "The user has been activated.",
              icon: "success"
            });
            this.getAllUsers();
          }
        });
      }
    });
  }

  deActiveUser(userData: any): void {
    const getAllUserUrl = this.apiSrivice.mainUrl + 'user/access';
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '',
      'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
      'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
      'user': `${localStorage.getItem("ulip-person-username")}`
    });

    Swal.fire({
      title: "Are you sure?",
      html: "You want to De-activate <b>" + userData.username + "</b>!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, De-Activate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post<any>(getAllUserUrl, { username: userData.username, status: 'InActive' }, { headers }).subscribe((response) => {
          if (response) {
            Swal.fire({
              title: "De-activated!",
              text: "The user has been de-activated.",
              icon: "success"
            });
            this.getAllUsers();
          }
        });
      }
    });
  }}
