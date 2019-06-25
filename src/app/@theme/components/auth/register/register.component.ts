/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '../../../../@core/utils/util';

@Component({
  selector: 'mes-register',
  styleUrls: ['./register.component.scss'],
  template: `
    <mes-auth-block>
      <h2 class="text-center">注册</h2>
      <form (ngSubmit)="register()" #form="ngForm">
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
          <input name="uid" [(ngModel)]="user.oid" id="input-uid" #uid="ngModel"
                 class="form-control" placeholder="用户账号"
                 [class.form-control-danger]="uid.invalid && uid.touched"
                 [required]="getConfigValue('forms.validation.uid.required')"
                 [minlength]="getConfigValue('forms.validation.uid.minLength')"
                 [maxlength]="getConfigValue('forms.validation.uid.maxLength')"
                 autofocus>
          <small class="form-text error" *ngIf="uid.invalid && uid.touched && uid.errors?.required">
            请输入您的用户账号!
          </small>
          <small
            class="form-text error"
            *ngIf="uid.invalid && uid.touched && (uid.errors?.minlength || uid.errors?.maxlength)">
            用户账号的长度范围
            从 {{getConfigValue('forms.validation.password.minLength')}}
            到 {{getConfigValue('forms.validation.password.maxLength')}}
            个字符
          </small>
        </div>

        <div class="form-group">
          <label for="input-name" class="sr-only">姓名</label>
          <input name="name" [(ngModel)]="user.name" id="input-name" #name="ngModel"
                 class="form-control" placeholder="姓名"
                 [class.form-control-danger]="name.invalid && name.touched"
                 [required]="getConfigValue('forms.validation.name.required')"
                 [minlength]="getConfigValue('forms.validation.name.minLength')"
                 [maxlength]="getConfigValue('forms.validation.name.maxLength')"
                 autofocus>
          <small class="form-text error" *ngIf="name.invalid && name.touched && name.errors?.required">
            请输入您的用户姓名!
          </small>
          <small
            class="form-text error"
            *ngIf="name.invalid && name.touched && (name.errors?.minlength || name.errors?.maxlength)">
            用户姓名的长度范围
            从 {{getConfigValue('forms.validation.password.minLength')}}
            到 {{getConfigValue('forms.validation.password.maxLength')}}
            个字符
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
            请输入您的密码!
          </small>
          <small
            class="form-text error"
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
            密码长度范围
            从 {{ getConfigValue('forms.validation.password.minLength') }}
            到 {{ getConfigValue('forms.validation.password.maxLength') }}
            个字符
          </small>
        </div>

        <div class="form-group">
          <label for="input-re-password" class="sr-only">确认密码</label>
          <input
            name="rePass" [(ngModel)]="user.confirmPassword" type="password" id="input-re-password"
            class="form-control" placeholder="确认密码" #rePass="ngModel"
            [class.form-control-danger]="(rePass.invalid || password.value != rePass.value) && rePass.touched"
            [required]="getConfigValue('forms.validation.password.required')">
          <small class="form-text error"
                 *ngIf="rePass.invalid && rePass.touched && rePass.errors?.required">
            请输入您的确认密码!
          </small>
          <small
            class="form-text error"
            *ngIf="rePass.touched && password.value != rePass.value && !rePass.errors?.required">
            两次输入的密码不匹配，请重新输入.
          </small>
        </div>

        <div class="form-group accept-group col-sm-12" *ngIf="getConfigValue('forms.register.terms')">
          <nb-checkbox name="terms" [(ngModel)]="user.terms" [required]="getConfigValue('forms.register.terms')">
            同意 <a href="#" target="_blank"><strong>相关条款</strong></a>
          </nb-checkbox>
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          注册
        </button>
      </form>

      <div class="links">
        <small class="form-text">
          已经注册了账号? <a routerLink="../login"><strong>登录</strong></a>
        </small>
      </div>
    </mes-auth-block>
  `,
})
export class MesRegisterComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected config = {},
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.provider = this.getConfigValue('forms.register.provider');
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.user.email = this.user.name + '@example.com';

    this.service.register(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      console.log(result);
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
