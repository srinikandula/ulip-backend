import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ApiHomeComponent } from './components/api-home/api-home.component';
import { ApiLogsComponent } from './components/api-logs/api-logs.component';
import { HomeComponent } from './components/home/home.component';


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

    ]
  },

  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "apilogs",
    component: ApiLogsComponent
  },

  {
    path: '', redirectTo: "login", pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
