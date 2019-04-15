import { Injectable } from '@angular/core';
import {CanActivate, Router,  ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(private router: Router) { }

   canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
     if(state.url.includes('form;formId')){
       localStorage.setItem('formId',state.url.substring(state.url.indexOf('=')+1))
     }
    if(localStorage.getItem('pid') != null || undefined)
      return true;
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }

}