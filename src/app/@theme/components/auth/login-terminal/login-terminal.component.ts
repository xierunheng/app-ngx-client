/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { ProsegService } from '../../../../@core/data/proseg.service';
import { PsubService } from '../../../../@core/data/psub.service';
import { UserService } from '../../../../@core/auth/user.service';
import { IDCmpFn, MaterialData, WorkData, UtilData } from '../../../../@core/data/util.service';
import { PsubProfile } from '../../../../@core/model/psub';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { ProsegElite } from '../../../../@core/model/proseg';
import { IUser } from '../../../../@core/model/user';
import { GlobalData } from '../../../../@core/model/global';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { getDeepFromObject } from '../../../../@core/utils/util';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import * as _ from 'lodash';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'mes-login-terminal',
  styleUrls: ['./login-terminal.component.scss'],
  template: `
    <mes-auth-block>

      <h2 class="title">终端登录</h2>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope" *ngIf="user">
        <div *ngIf="showMessages.success && messtoastconfigages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>
          <toaster-container [toasterconfig]="toastconfig"></toaster-container>
        <div class="form-group">
          <label for="input-ps" class="sr-only">工序</label>
          <select name="input-ps" [ngModel]="user.ps?.oid" id="input-ps" [compareWith]="idCmpFn"
                 class="form-control" placeholder="终端工序" #ps="ngModel"
                 [class.form-control-danger]="ps.invalid && ps.touched" [required]="true" (change)="onPsChange($event.target.value)">
            <option value="">--请选择工序--</option>
            <option *ngFor="let ps of pss">{{ps}}</option>
          </select>
          <small class="form-text error" *ngIf="ps.invalid && ps.touched && ps.errors?.required">
            请选择终端工序!
          </small>
          <small class="form-text error"
                 *ngIf="ps.invalid && ps.touched && ps.errors?.pattern">
            请选择正确的工序!
          </small>
        </div>
        <div class="form-group">
          <label for="input-hs" class="sr-only">工位</label>
          <select name="input-hs" [(ngModel)]="user.hs" id="input-hs" [compareWith]="idCmpFn"
                 class="form-control" placeholder="终端工位"  #hs="ngModel" select="selected"
                 [class.form-control-danger]="hs.invalid && hs.touched" [required]="true" >
            <option value="undefined">--请选择工位--</option>
            <option *ngFor="let hs of hss" [ngValue]="hs">{{hs.name}}</option>
          </select>
          <small class="form-text error" *ngIf="hs.invalid && hs.touched && hs.errors?.required">
            请选择终端工位!
          </small>
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
        <div class="col-sm-12 mb1 entries">
          <nb-checkbox name="rememberMe" [(ngModel)]="user.rememberMe">记住账号</nb-checkbox>
          <a class="forgot-password" routerLink="../request-password">忘记密码?</a>
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          登 录
        </button>
      </form>
    </mes-auth-block>
  `,
})
export class MesLoginTerminalComponent implements OnInit {
  pss: string[] = _.values(MaterialData.BodyOps).filter(bodyop => bodyop.url && bodyop.url !== '')
    .map(bodyop => bodyop.name);

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: IUser = {};
  submitted: boolean = false;
  hss: IHierarchyScope[] = GlobalData.hss;

  //弹窗配置
  toastconfig: ToasterConfig;
  position = 'toast-top-center';
  animationType = 'slideDown';
  title = '';
  content: string;
  timeout = 3000;
  toastsLimit = 1;
  type = 'error';

  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = false;
  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
  positions: string[] = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
    'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];

  //层级机构配置
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 220
  });

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(protected service: NbAuthService,
    protected psService: ProsegService,
    protected uService: UserService,
    protected psubService: PsubService,
    private toasterService: ToasterService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
  }

  ngOnInit(): void {
    let userStorage = localStorage.getItem('user');
    if (userStorage && userStorage !== 'undefined') {
      let user = JSON.parse(userStorage);
      if (user && user.rememberMe) {
        if (user.ps) {
          this.psService.getProsegBy({ oid: user.ps.oid }).subscribe(ps => {
            if (ps.opType === WorkData.opTypes[3]) {
              this.hss = GlobalData.hss.filter(item => (item.path.includes(ps.hs.name) || item.name.includes(ps.hs.name)) &&
                (item.level === UtilData.hsLevels[8] || item.level === UtilData.hsLevels[9] || item.level === UtilData.hsLevels[10]));
            } else {
              this.hss = GlobalData.hss.filter(item => item.path.includes(ps.hs.name) || item.name.includes(ps.hs.name));
            }
            this.user = user;
          });
        } else {
          this.user = user;
        }
      } else {
        this.user = {};
      }
    }
  }

  /**
   * [工序发生变化时，处理方式]
   * @param {[type]} ps [description]
   */
  onPsChange(ps) {
    this.psService.getProsegBy({ oid: ps }).subscribe(ps => {
      this.user.ps = new ProsegElite(ps);
      if (ps.opType === WorkData.opTypes[3]) {
        this.hss = GlobalData.hss.filter(item => (item.path.includes(ps.hs.name) || item.name.includes(ps.hs.name)) &&
          (item.level === UtilData.hsLevels[8] || item.level === UtilData.hsLevels[9] || item.level === UtilData.hsLevels[10]));
      } else {
        this.hss = GlobalData.hss.filter(item => item.path.includes(ps.hs.name) || item.name.includes(ps.hs.name));
      }
    });
  }

  clearToasts() {
    this.toasterService.clear();
  }

  private showToast(type: string, title: string, body: string) {
    this.toastconfig = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.user.email = this.user.name + '@example.com';

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
        this.type = "success";
        this.content = this.messages[0];
        this.showToast(this.type, this.title, this.content);
        localStorage.setItem('id_token', result.getResponse().body.token);
        return this.uService.get().subscribe(u => {
          u.ps = this.user.ps;
          u.hs = this.user.hs;
          u.rememberMe = this.user.rememberMe;
          return this.psubService.createPsubBy({
            p: u.person,
            hs: this.user.hs
          }).subscribe(psub => {
            u.psub = new PsubProfile(psub);
            _.forOwn(MaterialData.BodyOps, (value, key) => {
              if (value.name === this.user.ps.oid) {
                //把 op 一并记录下来
                u.op = key;
              }
            });
            localStorage.setItem('user', JSON.stringify(u));
            const redirect = _.values(MaterialData.BodyOps).find(item => item.name === this.user.ps.oid).url;
            console.log(redirect);
            if (redirect) {
              setTimeout(() => {
                return this.router.navigateByUrl(redirect);
              }, this.redirectDelay);
            }
          });
        })
      } else {
        this.errors = result.getErrors();
        if (this.errors.length > 0) {
          this.content = this.errors[0]
          this.showToast(this.type, this.title, this.content);
        }
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }

}
