import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, ConfirmEventType } from 'primeng/api';
import { ApiLogs } from 'src/app/ApiLogs';
import { apiService } from "../../services/api/apiservice";
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-edit-key',
  templateUrl: './edit-key.component.html',
  styleUrls: ['./edit-key.component.css']
})
export class EditKeyComponent implements OnInit {
handleOnUlipWChange() {
  let mytempSelect:string = "0000000000000000000000000000000"
  
  for (let i = 0; i < this.selectedItems.length; ++i) {
    let newStringArray = mytempSelect.split("");
    newStringArray[Number(this.selectedItems[i].item_id) - 1] = '1';
    mytempSelect = newStringArray.join("");
  }
  this.mySelectedString = mytempSelect
}
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings = {};
  mySelectedString: string = '0000000000000000000000000000000'
  onItemSelect(item: any) {
    console.log(item, this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  editKeyLogs: ApiLogs[] = []
  ipSet: string = "";
  handleFitUlipWlist(){
    console.log(this.mySelectedString, " is my selected string ")
    let myTempArr:any = []
    for(let i = 0; i<this.mySelectedString.length; ++i){
      if(this.mySelectedString[i] === '1'){
        myTempArr.push(this.dropdownList[i])
      }
    }
    this.selectedItems = myTempArr
  }
  handleOnSaveKey() {
    const myParamsKey = this.route.snapshot.paramMap.get('apikey');

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });

    const body = { "passKey": myParamsKey, "applicationName": this.applicationName, "ownerName": this.ownerName, "apiKey": this.apikey, "contactNo": this.contactName, "ulipAccess":this.mySelectedString };


    this.http.put<any>(this.apiSrivice.mainUrl + 'aping/updatekey', body, { headers }).subscribe({
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
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      if (this.position === "Current") {
        this.myIp = res.ip
      }
      const body = { "passKey": myParamsKey, myIp: this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}` };


      this.http.put<any>(this.apiSrivice.mainUrl + 'aping/changeip', body, { headers }).subscribe({
        next: data => {
          console.log(data)
          this.messageService.add({ severity: 'success', summary: 'IP changed successfully', detail: this.myIp });
          this.ipSet = this.position === "0.0.0.0" ? "0.0.0.0" : `${this.myIp}`
          this.visibleIP = false
          this.position = '0.0.0.0'
          console.log("My set ip is, ", this.ipSet)
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
  tableReqDatas: { data: string, val: string }[] = []

  confirmDelete(event: Event) {
    console.log("Confirm delete target ", event)
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this key?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {

        const myParamsKey = this.route.snapshot.paramMap.get('apikey');

        const headers = new HttpHeaders({
          'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
          'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
        });
        const body = { "apiKey": myParamsKey };
        const options = {
          headers: headers,
          body: { "apiKey": myParamsKey }
        };
        console.log("The link is ", this.apiSrivice.mainUrl + 'aping/deletemykey', body)
        this.http.delete<any>(this.apiSrivice.mainUrl + 'aping/deletemykey', { body: body, headers: headers }).subscribe({
          next: data => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'API key deleted' });
            this.router.navigate(['home/createkey'])
          },
          error: error => {
            console.error("There is an error", error)
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Key deletion Failed' });
          }
        })


      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }


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

        this.http.put<any>(this.apiSrivice.mainUrl + 'aping/toggle-api-key', body, { headers }).subscribe({
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
  constructor(private route: ActivatedRoute, private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router,
    private apiSrivice: apiService) {

  }
  api_filter_function_key(obj: ApiLogs) {
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


    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchmykey', body, { headers }).subscribe({
      next: data => {
        this.mySelectedString = data.mykey.ulipAccess
        this.applicationName = data.mykey.applicationName
        this.ownerName = data.mykey.ownerName
        this.apikey = data.mykey.key
        this.contactName = data.mykey.contactNo
        this.isEnabled = data.mykey.active
        this.ipSet = data.mykey.ip
        this.handleFitUlipWlist()
        console.log(data, "is my edit key", this.mySelectedString)
      },
      error: error => {
        console.error("There is an error", error)
      }
    })


    this.itemBreadCrumb = [{ label: 'Create Keys' }, { label: 'Edit Key' }];

    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchLogs', {}, { headers }).subscribe({
      next: data => {

        this.editKeyLogs = data.allLogs.filter(this.api_filter_function_key.bind(this));

        let umap = new Map();
        this.editKeyLogs.forEach(i => {
          if (!umap.has(i.ulip)) {
            umap.set(i.ulip, 1)
          }
          else {
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
    this.dropdownList = [
      { item_id: "01", item_text: 'VAHAN' },
      { item_id: "02", item_text: 'SARATHI' },
      { item_id: "03", item_text: 'FASTAG' },
      { item_id: "04", item_text: 'FOIS' },
      { item_id: "05", item_text: 'LDB' },
      { item_id: "06", item_text: 'ICEGATE' },
      { item_id: '07', item_text: 'EWAYBILL' },
      { item_id: "08", item_text: 'ECHALLAN' },
      { item_id: "09", item_text: 'DGFT' },
      { item_id: "10", item_text: 'PCS' },
      { item_id: "11", item_text: 'ACMES' },
      { item_id: "12", item_text: 'AACS' },
      { item_id: "13", item_text: 'AAICLAS' },
      { item_id: "14", item_text: 'DIGILOCKER' },
      { item_id: "15", item_text: 'FCI' },
      { item_id: "16", item_text: 'GATISHAKTI' },
    ];
    this.selectedItems = [
      
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };




  }

}
