import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';


const APP_ROUTES: Routes = [
  { path: '',
    component: HomeComponent
  },
  { path: 'signup',
    component: SignupComponent
  },
  { path: 'signin',
    component: SigninComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
