/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '../../../../@core/utils/util';
import { AuthService } from '../../../../@core/auth/auth.service';

@Component({
  selector: 'mes-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  template: `
    <mes-auth-block>
      <h2 class="title">修改密码</h2>
      <small class="form-text sub-title">请输入一个新的密码</small>
      <form (ngSubmit)="resetPass()" #resetPassForm="ngForm">

        <div *ngIf="errors && errors.length > 0 && !submitted" class="alert alert-danger" role="alert">
          <div><strong>不正确!</strong></div>
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>
        <div *ngIf="messages && messages.length > 0 && !submitted" class="alert alert-success" role="alert">
          <div><strong>成功!</strong></div>
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-old-password" class="sr-only">旧密码</label>
          <input name="oldPassword" [(ngModel)]="user.oldPassword" type="password" id="input-old-password"
                 class="form-control form-control-lg first" placeholder="旧密码" #oldPassword="ngModel"
                 [class.form-control-danger]="oldPassword.invalid && oldPassword.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')"
                 autofocus>
          <small class="form-text error" *ngIf="oldPassword.invalid && oldPassword.touched && oldPassword.errors?.required">
            请输入您的新密码!
          </small>
          <small
            class="form-text error"
            *ngIf="oldPassword.invalid && oldPassword.touched && (oldPassword.errors?.minlength || oldPassword.errors?.maxlength)">
            密码的长度范围
            从 {{getConfigValue('forms.validation.oldPassword.minLength')}}
            到 {{getConfigValue('forms.validation.oldPassword.maxLength')}}
            个字符
          </small>
        </div>

        <div class="form-group">
          <label for="input-password" class="sr-only">新密码</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control form-control-lg " placeholder="新密码" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')"
                 autofocus>
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            请输入您的新密码!
          </small>
          <small
            class="form-text error"
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
            密码的长度范围
            从 {{getConfigValue('forms.validation.password.minLength')}}
            到 {{getConfigValue('forms.validation.password.maxLength')}}
            个字符
          </small>
        </div>

        <div class="form-group">
          <label for="input-re-password" class="sr-only">确认密码</label>
          <input
            name="rePass" [(ngModel)]="user.confirmPassword" type="password" id="input-re-password"
            class="form-control form-control-lg last" placeholder="确认密码" #rePass="ngModel"
            [class.form-control-danger]="(rePass.invalid || password.value != rePass.value) && rePass.touched"
            [required]="getConfigValue('forms.validation.password.required')">
          <small class="form-text error"
                 *ngIf="rePass.invalid && rePass.touched && rePass.errors?.required">
            请输入您的确认密码!
          </small>
          <small
            class="form-text error"
            *ngIf="rePass.touched && password.value != rePass.value && !rePass.errors?.required">
            两次输入的密码不匹配，请重新输入密码.
          </small>
        </div>

        <button [disabled]="submitted || !resetPassForm.form.valid" class="btn btn-hero-success btn-block"
                [class.btn-pulse]="submitted">
          修改密码
        </button>
      </form>

      <div class="links col-sm-12">
        <small class="form-text">
          已经注册了账号? <a routerLink="../login"><strong>登录</strong></a>
        </small>
        <small class="form-text">
          <a routerLink="../register"><strong>注册</strong></a>
        </small>
      </div>
    </mes-auth-block>
  `,
})
export class MesResetPasswordComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(protected service: NbAuthService,
    protected AuthService: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.provider = this.getConfigValue('forms.resetPassword.provider');
  }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    return this.AuthService.changePassword(this.user.oldPassword, this.user.password, (err) => {
      if (err) {
        window.alert(err);
      } else {
        console.log('Password successfully changed.');
        const redirect = '/';
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
      }

    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
