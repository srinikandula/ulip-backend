import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, ConfirmEventType } from 'primeng/api';
import { ApiLogs } from 'src/app/ApiLogs';

@Component({
  selector: 'app-edit-key',
  templateUrl: './edit-key.component.html',
  styleUrls: ['./edit-key.component.css']
})
export class EditKeyComponent implements OnInit {
  editKeyLogs: ApiLogs[] = []
  handleOnSaveKey() {
    const myParamsKey = this.route.snapshot.paramMap.get('apikey');

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });

    const body = { "passKey": myParamsKey, "applicationName": this.applicationName, "ownerName": this.ownerName, "apiKey": this.apikey, "contactNo": this.contactName };


    this.http.put<any>('http://localhost:5000/aping/updatekey', body, { headers }).subscribe({
      next: data => {
        console.log(data)
        this.messageService.add({ severity: 'success', summary: 'API key changed Successfully', detail: this.applicationName });
        this.router.navigate(['home/createkey'])
      },
      error: error => {
        console.error("There is an error", error)
      }
    })
  }
  handleOnSetIP() {
    const myParamsKey = this.route.snapshot.paramMap.get('apikey');

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      if (this.position === "Current") {
        this.myIp = res.ip
      }
      const body = { "passKey": myParamsKey, myIp: this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}` };


      this.http.put<any>('http://localhost:5000/aping/changeip', body, { headers }).subscribe({
        next: data => {
          console.log(data)
          this.messageService.add({ severity: 'success', summary: 'IP changed successfully', detail: this.myIp });
          this.visibleIP = false
          this.position = '0.0.0.0'
        },
        error: error => {
          console.error("There is an error", error)
        }
      })
    })
  }
  visibleIP: boolean = false;
  position: string = "0.0.0.0";
  positionOptions = [
    {
      label: 'Allow access from anywhere',
      value: "0.0.0.0"
    },
    {
      label: 'Custom IP',
      value: "Custom"
    },
    {
      label: 'Current IP',
      value: "Current"
    }
  ];

  handleChangeContact() {
    if ((this.actionsArr.length > 0 && this.actionsArr[0] !== 'contact') || this.actionsArr.length === 0) {
      this.actionsArr.unshift('contact')
    }
  }
  handleChangeApi() {
    if ((this.actionsArr.length > 0 && this.actionsArr[0] !== 'API Key') || this.actionsArr.length === 0) {
      this.actionsArr.unshift('API Key')
    }
  }
  handleChangeOwner() {
    if ((this.actionsArr.length > 0 && this.actionsArr[0] !== 'Owner\'s Name') || this.actionsArr.length === 0) {
      this.actionsArr.unshift('Owner\'s Name')
    }
  }
  handleChangeAppname() {
    if ((this.actionsArr.length > 0 && this.actionsArr[0] !== 'Application Name') || this.actionsArr.length === 0) {
      this.actionsArr.unshift('Application Name')
    }
    console.log(this.actionsArr)
  }
  handleEditEnable() {
    this.setEdit = true
  }

  itemBreadCrumb: MenuItem[] | undefined;
  applicationName: string = "";
  ownerName: string = "";
  apikey: string = "";
  myParamsKeyLog: string = ""
  contactName: string = "";
  isEnabled: boolean = false;
  myIp: string = "0.0.0.0";
  setEdit: boolean = false
  actionsArr: string[] = [];
  tokeVal: string = `${localStorage.getItem("authtoken")}`;
  tableReqDatas:{data:string, val:string}[] = []

  confirmDisable(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to ${this.isEnabled ? "disable" : "enable"} the key?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {


        const myParamsKey = this.route.snapshot.paramMap.get('apikey');

        const headers = new HttpHeaders({
          'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
          'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
        });
        const body = { "passKey": myParamsKey, isEnable: this.isEnabled };

        this.http.put<any>('http://localhost:5000/aping/toggle-api-key', body, { headers }).subscribe({
          next: data => {
            console.log(data)
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            this.isEnabled = !this.isEnabled;
          },
          error: error => {
            console.error("There is an error", error)
          }
        })

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }



  handleIpConfigShow() {
    this.visibleIP = true
  }
  constructor(private route: ActivatedRoute, private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {

  }
  api_filter_function_key(obj: ApiLogs, myParamsKey: string) {
    console.log("myy params key", this.myParamsKeyLog, obj.key)
    if (obj.key === this.myParamsKeyLog) {
      return true
    }
    return false
  }
  ngOnInit() {
    const myParamsKey = this.route.snapshot.paramMap.get('apikey');
    this.myParamsKeyLog = `${this.route.snapshot.paramMap.get('apikey')}`

    console.log("my params key is ", myParamsKey)


    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    const body = { "passKey": myParamsKey };

    console.log(localStorage.getItem('authtoken'))


    this.http.post<any>('http://localhost:5000/aping/fetchmykey', body, { headers }).subscribe({
      next: data => {
        this.applicationName = data.mykey.applicationName
        this.ownerName = data.mykey.ownerName
        this.apikey = data.mykey.key
        this.contactName = data.mykey.contactNo
        this.isEnabled = data.mykey.active
        console.log(data, "is my edit key")
      },
      error: error => {
        console.error("There is an error", error)
      }
    })


    this.itemBreadCrumb = [{ label: 'Create Keys' }, { label: 'Edit Key' }];

    this.http.post<any>('http://localhost:5000/aping/fetchLogs', {}, { headers }).subscribe({
      next: data => {

        this.editKeyLogs = data.allLogs.filter(this.api_filter_function_key.bind(this));

        let umap = new Map();
        this.editKeyLogs.forEach(i => {
          if(!umap.has(i.ulip)){
            umap.set(i.ulip, 1)
          }
          else{
            umap.set(i.ulip, umap.get(i.ulip) + 1)

          }
        });
        let reqArr: { data: string, val: string }[] = []
        for (let [key, value] of umap) {
          let tempArr = {
            data: key,
            val: value
          }
          reqArr.push(tempArr)
        }
        this.tableReqDatas = reqArr


      },
      error: error => {
        console.error("There is an error", error)
      }
    })




  }

}
