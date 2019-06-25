import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'terminal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() person: any;
  @Input() logo: any;
  @Output() titleClick = new EventEmitter<any>();

  constructor(private modalService: NgbModal,
    private router: Router) {
  }

  ngOnInit() {

  }

  onTitleClick() {
    this.titleClick.emit();
  }

  logout() {
    if(window.confirm('即将退出登录，是否继续？')) {
      let user = JSON.parse(localStorage.getItem('user'));
      localStorage.removeItem('id_token');
      if (user && !user.rememberMe) {
        localStorage.removeItem('user');
      }
      this.router.navigate(['/auth/login-terminal']);
    }
  }

}
