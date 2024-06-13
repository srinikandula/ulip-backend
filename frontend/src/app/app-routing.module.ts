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


const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [{
      path: "createkey",
      component: ApiHomeComponent
    },
    {
      path: "keylogs",
      component: ApiLogsComponent
    },
    {
      path: 'editkey/:apikey',
      component: EditKeyComponent
    },
    {
      path: 'tools/fetchulip',
      component: FetchulipComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'analytics',
      component: InfographicsComponent
    },
    {
      path: 'bulkUpload',
      component: BulkUploadComponent
    },
      {
      path: 'userAccess',
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
