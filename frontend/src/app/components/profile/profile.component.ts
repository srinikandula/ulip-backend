import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KeypageService} from "../../services/keypage/keypage.service";
import {apiService} from "../../services/api/apiservice";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import CryptoJS from "crypto-js";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    public userName: any;
    public tokeVal: any;
    public secretKey:any= "mllf3xpex2kPk"
    public oldPassword: any
    public newPassword: any;
    public confirmPassword: any;


    constructor(
        private router: Router,
        public keypage: KeypageService,
        private apiSrivice: apiService,
        private http: HttpClient,
        private messageService: MessageService,) {
        this.userName = `${localStorage.getItem('ulip-person-username')}`;
        this.tokeVal = localStorage.getItem('authtoken');
    }

    ngOnInit() {
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.changePassword();
        }
    }

    onSubmit() {
        this.changePassword();
    }
    changePassword(): void {
        console.log(this.newPassword)
        if (this.newPassword == ''||this.newPassword==undefined) {
            this.messageService.add({ severity: 'error', summary:'Please Enter New Password', detail: ""})
     } else if(this.oldPassword==''||this.oldPassword==undefined){
        this.messageService.add({ severity: 'error', summary:'Please Enter Old Password', detail: ""})
     }else if(this.confirmPassword==''||this.confirmPassword==undefined){
        this.messageService.add({ severity: 'error', summary:'Please Enter confirm password', detail: ""})

     } else if(this.newPassword != this.confirmPassword){
        this.messageService.add({ severity: 'error', summary:'New password and confirm password do not match!', detail: ""})

    }else {
        const encryptedOldPassword = CryptoJS.AES.encrypt(this.oldPassword, this.secretKey).toString();
        const encryptedNewPassword = CryptoJS.AES.encrypt(this.newPassword, this.secretKey).toString();
        const encryptedNewConfirmPassword = CryptoJS.AES.encrypt(this.confirmPassword, this.secretKey).toString();
        const getAllUserUrl = this.apiSrivice.mainUrl + 'aping/changePassword';
        const headers = new HttpHeaders({
            'auth-token': this.tokeVal || '',
            'api-key': "16f78afa-e306-424e-8a08-21ad21629404",
            'seckey': "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b",
            'user': `${localStorage.getItem("ulip-person-username")}`
        });
        this.http.post<any>(getAllUserUrl,
            {
                oldPassword: encryptedOldPassword,
                newPassword: encryptedNewPassword,
                confirmPassword:encryptedNewConfirmPassword
                },
            {headers}).subscribe((response) => {
            if (response) {
                this.messageService.add({ severity: 'success', summary: response.message, detail: ""})
                localStorage.clear();
                this.router.navigate(['/login']);
            }
        },error => {
            this.messageService.add({ severity: 'error', summary: error.error.message, detail: ""})
        })
    }
    }
}
