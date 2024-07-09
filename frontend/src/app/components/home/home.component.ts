import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { KeypageService } from 'src/app/services/keypage/keypage.service';
import {apiService} from "../../services/api/apiservice";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userRole: any
  public userName: any
  navigateFetchUlip() {
    this.router.navigate(["home/tools/fetchulip"])
  }
  itemsMenuProfile: MenuItem[] = [];
  ulipPersonName: string = ""
  sidebarOpen: boolean = true;
  sidebarHover: boolean = false;
  sideDueToClick: boolean = true;

  navigateViewLogs() {
    this.router.navigate(["home/keylogs"])

  }
  navigateViewAnalytics() {
    this.router.navigate(["home/analytics"])
  }
  navigateToBulkUpload() {
    this.router.navigate(["home/bulkUpload"])
  }
  navigateToUserAccess() {
    this.router.navigate(["home/userAccess"])
  }
  handleOnLeftbarToggle() {
    this.sidebarOpen = !this.sidebarOpen
    this.sideDueToClick = !this.sideDueToClick

  }
  handleOnMouseOverSidebar() {
    if (!this.sidebarOpen && !this.sideDueToClick) {
      this.sidebarHover = true
      this.sidebarOpen = true
    }

  }
  handleOnMouseOutSidebar() {
    if (!this.sideDueToClick) {
      this.sidebarHover = false
      this.sidebarOpen = false

    }
  }
  navigateCreateKeys() {
    this.router.navigate(["home/createkey"])
  }

  constructor(private router: Router,private messageService: MessageService, public keypage: KeypageService, private apiSrivice: apiService, private http: HttpClient,) {
    this.ulipPersonName = `${localStorage.getItem('ulip-person-username')}`;
  }

  handleOnLogout() {
    this.http.post(this.apiSrivice.mainUrl +'user/logout', {username: this.userName}).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Logged out successfully', detail: ""})
          window.location.reload();
        },
        error => {
          localStorage.removeItem("authtoken")
          console.error('Logout failed', error);
        }
    );
    localStorage.removeItem("ulip-person-tokenId")
    localStorage.removeItem("authtoken")
    localStorage.removeItem("ulip-person-username")
    localStorage.removeItem("roleId")
    localStorage.removeItem("roleName")
    this.router.navigate(['login'])
  }
  ngOnInit() {
    this.userRole = localStorage.getItem('roleName')
    this.userName = localStorage.getItem('ulip-person-username')
    console.log(this.userRole)
    if (!localStorage.getItem("authtoken")) {
      this.router.navigate(['login'])
    }

    this.itemsMenuProfile = [
      {
        label: 'Options',
        items: [
          {
            label: 'Logout',
            // icon: 'pi pi-refresh',
            command: () => {
              this.handleOnLogout();
            }
          },
          {
            label: 'Change Password',
            command: () => {
              this.router.navigate(["home/changePassword"])
            }
          }
        ]
      },
    ];

  }



}
