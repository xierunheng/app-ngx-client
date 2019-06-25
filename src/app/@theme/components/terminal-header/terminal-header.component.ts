import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import {ViewConfig} from '../../../@core/utils/config';

@Component({
  selector: 'mes-terminal-header',
  templateUrl: './terminal-header.component.html',
  styleUrls: ['./terminal-header.component.scss']
})
export class TerminalHeaderComponent implements OnInit {
  //界面配置接口
  vConfig: ViewConfig;

  user: any;

  constructor(private router: Router,
  	private route: ActivatedRoute) {
  	this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  	console.log(this.route);
  	this.route.firstChild.data.subscribe(data => {
  		console.log(data);
      this.vConfig = ViewConfig.create(data.config);
      console.log(this.vConfig);
    });
  }

  logout() {
    let user = JSON.parse(localStorage.getItem('user')); 
    localStorage.removeItem('id_token');
    if(user && !user.rememberMe) {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/auth/login-terminal']);
  }
}
