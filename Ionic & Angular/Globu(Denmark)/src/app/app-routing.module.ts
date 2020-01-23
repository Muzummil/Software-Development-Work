import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule' 
  },
  { 
    path: 'register', 
    loadChildren: './register/register.module#RegisterPageModule' 
  },
  { 
    path: 'terms', 
    loadChildren: './terms/terms.module#TermsPageModule' 
  },
  { 
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule' 
  },
  { 
    path: 'signup', 
    loadChildren: './signup/signup.module#SignupPageModule' 
  },
  { path: 'allevents', 
    loadChildren: './allevents/allevents.module#AlleventsPageModule' 
  },
  { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'detail/:id', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'profilesignup', loadChildren: './profilesignup/profilesignup.module#ProfilesignupPageModule' },
  { path: 'sidemenu', loadChildren: './sidemenu/sidemenu.module#SidemenuPageModule' },
  { path: 'addEvent', loadChildren: './add-event/add-event.module#AddEventPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
