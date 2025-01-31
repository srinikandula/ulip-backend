import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ApiHomeComponent } from './components/api-home/api-home.component';
import { ApiLogsComponent } from './components/api-logs/api-logs.component';
import { HomeComponent } from './components/home/home.component';
import { EditKeyComponent } from './components/edit-key/edit-key.component';
import { SignupComponent } from './components/signup/signup.component';
import { FetchulipComponent } from './components/tools/fetchulip/fetchulip.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InfographicsComponent } from './components/infographics/infographics.component';
import {BulkUploadComponent} from "./components/bulk-upload/bulk-upload.component";
import {UsersAccessComponent} from "./components/users-access/users-access.component";
import {AuthGuard} from "./healper/auth.guard";


const routes: Routes = [
  {
    path: "home",
    data:{expectedRole:['2', '1']},
    component: HomeComponent,
    children: [
      {
        path: 'tools/fetchulip',
        data:{expectedRole:['2', '1']},
        canActivate:[AuthGuard],
        component: FetchulipComponent
      },
      {
        path: 'bulkUpload',
        canActivate:[AuthGuard],
        data:{expectedRole:['2', '1']},
        component: BulkUploadComponent
      },
        {
      path: "createkey",
      canActivate:[AuthGuard],
      data:{expectedRole:[ '1']},
      component: ApiHomeComponent
    },
    {
      path: "keylogs",
      data:{expectedRole:[ '1']},
      canActivate:[AuthGuard],
      component: ApiLogsComponent
    },
    {
      path: 'editkey/:apikey',
      data:{expectedRole:['1']},
      canActivate:[AuthGuard],
      component: EditKeyComponent
    },
    {
      path: 'tools/fetchulip',
      data:{expectedRole:['2', '1']},
      canActivate:[AuthGuard],
      component: FetchulipComponent
    },
    {
      path: 'changePassword',
      data:{expectedRole:['2', '1']},
      canActivate:[AuthGuard],
      component: ProfileComponent
    },
    {
      path: 'analytics',
      data:{expectedRole:['1']},
      canActivate:[AuthGuard],
      component: InfographicsComponent
    },
      {
      path: 'userAccess',
        canActivate:[AuthGuard],
        data:{expectedRole:['1']},
      component: UsersAccessComponent
    }

    ]
  },

  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "apilogs",
    component: ApiLogsComponent
  },

  {
    path: '', redirectTo: "login", pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
