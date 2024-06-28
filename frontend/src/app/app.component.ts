import {Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import {BnNgIdleService} from "bn-ng-idle";
import {Router} from "@angular/router";
import {apiService} from "./services/api/apiservice";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public userName: any
  constructor(private messageService: MessageService,
              private bnIdle: BnNgIdleService,
              private router: Router,
              private apiSrivice: apiService,
              private http: HttpClient,){
    this.userName = localStorage.getItem('ulip-person-username')
  }
 

  title = 'Mahindra ULIP Interface';

  ngOnInit(): void {
    // this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut === true) {
    //     // this.http.post(this.apiSrivice.mainUrl + 'user/logout', {username: this.userName}).subscribe((res: any) => {
    //       console.log('session expired');
    //     this.messageService.add({ severity: 'error', summary: 'session expired', detail: "" })
    //           localStorage.clear();
    //           this.router.navigate(['/login']);
    //
    //     //     }
    //     // );
    //   }
    // });
  }
}
