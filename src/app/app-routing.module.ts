import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { AuthGaurdService } from './auth-gaurd.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'dashboard', component: MenuComponent, children: [
    {path: 'home', loadChildren: './qrcode-home/qrcode-home.module#QrcodeHomePageModule'},
    { path: 'form', loadChildren: './form/form.module#FormPageModule' },
    {path: 'form:formId', loadChildren: './form/form.module#FormPageModule'  },
    { path: 'user-settings', loadChildren: './user-settings/user-settings.module#UserSettingsPageModule' }

  ], canActivate: [AuthGaurdService]},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
