/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '../../../../@core/utils/util';
import { UserService } from '../../../../@core/auth/user.service';
import { IUser } from '../../../../@core/model/user';

@Component({
  selector: 'mes-login',
  template: `
    <mes-auth-block>
      <h2 class="title">登录</h2>
      <small class="form-text sub-title">您好! 请输入您的用户名及密码</small>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">

        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div><strong>不正确!</strong></div>
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div><strong>成功!</strong></div>
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-uid" class="sr-only">账号</label>
          <input name="uid" [(ngModel)]="user.name" id="input-uid"
                 class="form-control" placeholder="用户账号" #uid="ngModel"
                 [class.form-control-danger]="uid.invalid && uid.touched" autofocus
                 [required]="getConfigValue('forms.validation.uid.required')">
          <small class="form-text error" *ngIf="uid.invalid && uid.touched && uid.errors?.required">
            请输入用户账号!
          </small>
          <small class="form-text error"
                 *ngIf="uid.invalid && uid.touched && uid.errors?.pattern">
            请输入正确的用户账号!
          </small>
        </div>

        <div class="form-group">
          <label for="input-password" class="sr-only">密码</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="密码" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')">
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            请输入用户密码!
          </small>
          <small
            class="form-text error"
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
            密码长度范围
            从 {{ getConfigValue('forms.validation.password.minLength') }}
            到 {{ getConfigValue('forms.validation.password.maxLength') }}
            字符
          </small>
        </div>

        <div class="form-group accept-group col-sm-12">
          <nb-checkbox name="rememberMe" [(ngModel)]="user.rememberMe">记住账号</nb-checkbox>
          <a class="forgot-password" routerLink="../request-password">忘记密码?</a>
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          登录
        </button>
      </form>

      <div class="links">
        <small class="form-text">
          还没有账号? <a routerLink="../register"><strong>注册</strong></a>
        </small>
      </div>
    </mes-auth-block>
  `,
})
export class MesLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected uService: UserService,
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');

    let userStorage = localStorage.getItem('user');
    if (userStorage && userStorage !== 'undefined') {
      let user = JSON.parse(userStorage);
      if (user && user.rememberMe) {
        this.user = user;
      }
    }
  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.user.email = this.user.name + '@example.com';

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      console.log(result);
      if (result.isSuccess()) {
        this.messages = result.getMessages();
        localStorage.setItem('id_token', result.getResponse().body.token);
        return this.uService.get().subscribe(u => {
          u.rememberMe = this.user.rememberMe;
          localStorage.setItem('user', JSON.stringify(u));

          // const redirect = result.getRedirect();
          const redirect = '/pages/main';
          if (redirect) {
            setTimeout(() => {
              return this.router.navigateByUrl(redirect);
            }, this.redirectDelay);
          }
        });
      } else {
        this.errors = result.getErrors();
      }


    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
