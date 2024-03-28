import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { ApiKeys } from 'src/app/ApiKeys';
import { ApiLogs } from 'src/app/ApiLogs';
import { apiService } from 'src/app/services/api/apiservice';
import { KeypageService } from 'src/app/services/keypage/keypage.service';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html',
  styleUrls: ['./infographics.component.css']
})
export class InfographicsComponent implements OnInit {
  totalReq:Number = 0
  totalSucReq:Number = 0
  myAllLogs: ApiLogs[] = []
  myAllLogsPresent: ApiLogs[] = []
  dataPie: any;
  optionsPie: any;

  dataPieP1: any;
  optionsPieP1: any;

 

  dataLineAppli: any;
  optionsLineAppli: any;

  dataLineAll: any;
  optionsLineAll: any;

  dataInfoUlip: any;
  optionsInfoUlip: any

  panelViewNum: Number = 0;


  api_filter_function_key(obj: ApiLogs) {
    // console.log("myy params key", this.myParamsKeyLog, obj.key)
    if (obj.key === this.selectedDropDown1?.name) {
      return true
    }
    return false
  }
  api_filter_function_appli(obj: ApiLogs) {
    if (obj.applicationName === this.selectedDropDown1p1?.name) {
      return true
    }
    return false
  }

  

  handleOnKeyChange() {
    this.selectedDropDown2 = { name: '', code: '' }
    this.selectedDropDown2p1 = { name: '', code: '' }
  }


  handleOnApiUsageChangep1() {

    if (this.selectedDropDown2p1?.code === "0") {

      this.myAllLogs = []
      if (this.selectedDropDown2p1?.code === "0") {
        this.myAllLogs = this.myAllLogsPresent.filter(this.api_filter_function_appli.bind(this));
        console.log("My all logs ", this.myAllLogs)
        let myFilterPie: { data: string, val: string }[] = []



        let umap = new Map();
        this.myAllLogs.forEach(i => {
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
        myFilterPie = reqArr
        const myLablels: string[] = []
        const myCounts: string[] = []
        for (let i = 0; i < myFilterPie.length; ++i) {
          myLablels.push(myFilterPie[i].data)
          myCounts.push(myFilterPie[i].val)
        }

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.dataPieP1 = {
          labels: myLablels,
          datasets: [
            {
              data: myCounts,
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
          ]
        };

        this.optionsPieP1 = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor
              }
            }
          }
        };


      }


    }


    else if (this.selectedDropDown2p1?.code === "1") {



      // For third Map
      this.myAllLogs = []
      this.myAllLogs = this.myAllLogsPresent.filter(this.api_filter_function_appli.bind(this));
      console.log("My all logs are ", this.myAllLogs)
      const dDown3Map = new Map()
      for (let i = 0; i < this.myAllLogs.length; ++i) {
        const myDateData = new Date(Number(this.myAllLogs[i].time))
        console.log("my logs is ", myDateData.getFullYear())
        dDown3Map.set(String(myDateData.getFullYear()), true)
      }
      let it = 0
      for (let [key, value] of dDown3Map) {
        let obj = {
          name: key,
          code: String(it)
        }
        this.dropDown3p1 = []
        this.dropDown3p1?.push(obj)
        console.log("my key si ", this.dropDown3p1)
        it++;
      }
      this.handleOnApiYearChangep1()

    }

  }

  handleOnChangePanel1() {
    this.panelViewNum = 1
    console.log("My panel view change ", this.panelViewNum)
  }

  

  handleOnApiYearChangep1() {

    if (this.selectedDropDown2p1?.code === "1") {

      const myMonthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let myReqArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.myAllLogs.length; ++i) {
        let mydate = new Date(Number(this.myAllLogs[i].time))
        if (String(mydate.getFullYear()) === this.selectedDropDown3p1?.name) {
          myReqArr[(mydate.getMonth())]++
        }
      }

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.dataLineAppli = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [

          {
            label: 'Third Dataset',
            data: myReqArr,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--orange-500'),
            tension: 0.4,
            backgroundColor: 'rgba(255,167,38,0.2)'
          }
        ]
      };

      this.optionsLineAppli = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      };


    }

  }

  basicData: any;

  basicOptions: any;
  tokeVal: string = `${localStorage.getItem("authtoken")}`;
  dropDown1: City[] | undefined;
  selectedDropDown1: City | undefined;

  dropDown2: City[] | undefined;
  selectedDropDown2: City | undefined;

  dropDown3: City[] | undefined;
  selectedDropDown3: City | undefined;

  dropDown1p1: City[] | undefined;
  selectedDropDown1p1: City | undefined;

  dropDown2p1: City[] | undefined;
  selectedDropDown2p1: City | undefined;

  dropDown3p1: City[] | undefined;
  selectedDropDown3p1: City | undefined;

  apiKeysList: ApiKeys[] = []

  constructor(private http: HttpClient, private router: Router, public keypage: KeypageService, private messageService: MessageService,
    private apiSrivice: apiService) { }
  handleIfHeader1() {
    this.dropDown1 = []
    this.dropDown1p1 = []
    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchKeys', {}, { headers }).subscribe({
      next: data => {
        console.log(data)

        this.apiKeysList = data.allKey
        for (let i = 0; i < data.allKey.length; ++i) {
          if (data.allKey[i].active === true) {
            let obj: City = {
              name: data.allKey[i].key,
              code: String(i)
            }
            let obj2: City = {
              name: data.allKey[i].applicationName,
              code: String(i)
            }
            this.dropDown1?.push(obj)
            this.dropDown1p1?.push(obj2)

          }
        }


      },
      error: error => {
        console.error("There is an error", error)
      }
    })

    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchLogs', {}, { headers }).subscribe({
      next: data => {


        this.myAllLogsPresent = data.allLogs
        // console.log("MY all logs ", this.myAllLogs, data)

      },
      error: error => {
        console.error("There is an error", error)
      }
    })
    console.log("MY all logs ", this.myAllLogs)


    this.dropDown2 = [
      { name: "Ulip Usage", code: "0" },
      { name: "API key Timeline", code: "1" }
    ]
    this.dropDown2p1 = [
      { name: "Ulip Usage", code: "0" },
      { name: "API key Timeline", code: "1" }
    ]

  }

  ngOnInit() {
    this.keypage.pageNav = 3
    this.handleIfHeader1()

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    // For Infographics Section

    const headers = new HttpHeaders({
      'auth-token': this.tokeVal || '', // Ensure a default value if authtoken is null
      'Content-Type': 'application/json' // 'content-type' changed to 'Content-Type'
    });
    
    this.http.post<any>(this.apiSrivice.mainUrl + 'aping/fetchLogs', {}, { headers }).subscribe({
      next: data => {


        this.myAllLogsPresent = data.allLogs
        this.totalReq = data.allLogs.length
        this.totalSucReq = 0
        let tempcountSuc = 0;
        console.log(data.allLogs, "are my logs")
        for(let i = 0; i<data.allLogs.length; ++i){
          console.log("logis ", (data.allLogs[i]))
          if(data.allLogs[i].resData && JSON.parse(data.allLogs[i].resData).code && Number(JSON.parse(data.allLogs[i].resData).code) === 200){
            tempcountSuc++
          }
        }
        this.totalSucReq = tempcountSuc
        this.myAllLogs = []

        this.myAllLogs = this.myAllLogsPresent

        let myFilterPie: { data: string, val: string }[] = []
        let umap = new Map();
        this.myAllLogsPresent.forEach(i => {
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
        myFilterPie = reqArr
        console.log("My filter pie is ", myFilterPie)
        const myLablels: string[] = []
        const myCounts: string[] = []
        for (let i = 0; i < myFilterPie.length; ++i) {
          myLablels.push(myFilterPie[i].data)
          myCounts.push(myFilterPie[i].val)
        }


        this.dataInfoUlip = {
          labels: myLablels,
          datasets: [
            {
              data: myCounts,
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
          ]
        };

        this.optionsInfoUlip = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor
              }
            }
          }
        };


      let currentTime = new Date()
      const currentYear = currentTime.getFullYear()
      const dDown3MapTemp = new Map()
      for (let i = 0; i < this.myAllLogs.length; ++i) {
        const myDateData = new Date(Number(this.myAllLogs[i].time))
        console.log("my logs is ", myDateData.getFullYear())
        dDown3MapTemp.set(String(myDateData.getFullYear()), true)
      }
      let it = 0
      for (let [key, value] of dDown3MapTemp) {
        let obj = {
          name: key,
          code: String(it)
        }
        this.dropDown3p1 = []
        this.dropDown3p1?.push(obj)
        console.log("my key si ", this.dropDown3p1)
        it++;
      }

      const myMonthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let myReqArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.myAllLogsPresent.length; ++i) {
        let mydate = new Date(Number(this.myAllLogsPresent[i].time))
        if (String(mydate.getFullYear()) === String(currentYear)) {
          myReqArr[(mydate.getMonth())]++
        }
      }

      // const documentStyle = getComputedStyle(document.documentElement);
      // const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.dataLineAll = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [

          {
            label: 'Third Dataset',
            data: myReqArr,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--orange-500'),
            tension: 0.4,
            backgroundColor: 'rgba(255,167,38,0.2)'
          }
        ]
      };

      this.optionsLineAll = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      


    }


      },
      error: error => {
        console.error("There is an error", error)
      }
    })







  }
}
