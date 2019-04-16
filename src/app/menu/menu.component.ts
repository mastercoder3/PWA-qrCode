import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  user;

  constructor(private router: Router , private ngZone: NgZone, private api:ApiService) { }

  ngOnInit() {
    this.api.getUser(localStorage.getItem('pid'))
      .subscribe(res =>{
        this.user;
      })
  }

  logout(){
    localStorage.clear();
    // this.ngZone.run()
    this.router.navigate(['login']);
  }

}
