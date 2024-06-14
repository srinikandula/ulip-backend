import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { KeypageService } from 'src/app/services/keypage/keypage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userRole: any
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

  constructor(private router: Router, public keypage: KeypageService) {
    this.ulipPersonName = `${localStorage.getItem('ulip-person-username')}`;
  }

  handleOnLogout() {
    localStorage.removeItem("authtoken")
    this.router.navigate(['login'])
  }
  ngOnInit() {
    this.userRole = localStorage.getItem('roleName')
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
            label: 'Dashboard',
            command: () => {
              this.router.navigate(["home/profile"])
            }
          }
        ]
      },
    ];

  }



}
