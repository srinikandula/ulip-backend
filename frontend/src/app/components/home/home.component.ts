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
  itemsMenuProfile: MenuItem[] = [];
  
navigateViewLogs() {
  this.router.navigate(["home/keylogs"])

}
navigateCreateKeys() {
  this.router.navigate(["home/createkey"])
}

  constructor(private router:Router, public keypage:KeypageService){
    
  }

  handleOnLogout(){
    localStorage.removeItem("authtoken")
    this.router.navigate(['login'])
  }
  ngOnInit() {

    if(!localStorage.getItem("authtoken")){
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
            // icon: 'pi pi-times',
            // command: () => {
            //     this.delete();
            // }
          }
        ]
      },
    ];
    
  }
  
 

}
