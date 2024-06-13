import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ApiHomeComponent } from './components/api-home/api-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"
import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";
import { SideBarComponent } from './components/api-home/side-bar/side-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { KeypageService } from './services/keypage/keypage.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from './services/toast/toast.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiLogsComponent } from './components/api-logs/api-logs.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MenuModule } from 'primeng/menu';
import { HomeComponent } from './components/home/home.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { WebsocketService } from './services/websocket/websocket.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EditKeyComponent } from './components/edit-key/edit-key.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { SplitterModule } from 'primeng/splitter';
import { DropdownModule } from 'primeng/dropdown';
import { FetchulipComponent } from './components/tools/fetchulip/fetchulip.component';
import { InfographicsComponent } from './components/infographics/infographics.component';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { TreeTableModule } from 'primeng/treetable';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component';
import { DragdropfileDirective } from './directive/dragdropfile.directive';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { UsersAccessComponent } from './components/users-access/users-access.component';



// const ngxUiLoaderConfig: NgxUiLoaderConfig = {
//   "bgsColor": "red",
//   "bgsOpacity": 0.5,
//   "bgsPosition": "bottom-right",
//   "bgsSize": 60,
//   "bgsType": "ball-spin-clockwise",
//   "blur": 5,
//   "delay": 0,
//   "fastFadeOut": true,
//   "fgsColor": "#ffffff",
//   "fgsPosition": "center-center",
//   "fgsSize": 60,
//   "fgsType": "ball-spin-clockwise",
//   "gap": 24,
//   "logoPosition": "center-center",
//   "logoSize": 120,
//   "logoUrl": "",
//   "masterLoaderId": "master",
//   "overlayBorderRadius": "0",
//   "overlayColor": "rgba(40, 40, 40, 0.8)",
//   "pbColor": "red",
//   "pbDirection": "ltr",
//   "pbThickness": 3,
//   "hasProgressBar": false,
//   "text": "",
//   "textColor": "#FFFFFF",
//   "textPosition": "center-center",
//   "maxTime": -1,
//   "minTime": 300
// }

// const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ApiHomeComponent,
    SideBarComponent,
    ApiLogsComponent,
    ProfileComponent,
    HomeComponent,
    EditKeyComponent,
    FetchulipComponent,
    InfographicsComponent,
    BulkUploadComponent,
    DragdropfileDirective,
    SpinnerComponent,
    UsersAccessComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    SidebarModule,
    ToastModule,
    ProgressSpinnerModule,
    MenuModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    TableModule,
    // SocketIoModule.forRoot(config),
    RadioButtonModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    CalendarModule,
    SplitterModule,
    DropdownModule,
    TabViewModule,
    ChartModule,
    TreeTableModule,
    SkeletonModule,
    ProgressBarModule,
    SliderModule,
    MultiSelectModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  providers: [KeypageService, MessageService, ToastService, WebsocketService, ConfirmationService, {
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
