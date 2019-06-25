import { Component, ElementRef, ViewChild } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

import { User } from "./user.model";
import {UserService} from "./user.service";

@Component({
    selector: "mes-m-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoggingIn = true;
    user: User;
    processing = false;
    userData = [
        new User('admin','admin','admin')
    ]
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(
      private page: Page,
      private routerExtensions: RouterExtensions,
      private userService:UserService) {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.email = "admin";
        this.user.password = "admin";
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.alert("请填写账号和密码！");
            return;
        }

        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        // this.userService.login(this.user)
        //     .then(() => {
        //         this.processing = false;
        //         this.routerExtensions.navigate(["/home"], { clearHistory: true });
        //     })
        //     .catch(() => {
        //         this.processing = false;
        //         this.alert("Unfortunately we could not find your account.");
        //     });
        let loginFlag = true;
        this.userData.map(user=>{
            if(this.user.email===user.email&&this.user.password===user.password){
                this.processing = false;
                this.user = user;
                UserService.setCurrentUser(this.user.email);
                loginFlag = false;
                this.routerExtensions.navigate(["/home"],{ clearHistory: true });
                // this.routerExtensions.navigate(["/home"]);
                return;
            }
        });
        if(loginFlag){
            this.processing = false;
            this.alert("抱歉，未能找到与之对应的账号和密码！");
        }
        // if(this.user.email==='admin'&&this.user.password==='admin'){
        //     this.processing = false;
        //     this.routerExtensions.navigate(["/home"],{ clearHistory: true });
        // }else{
        //     this.processing = false;
        //     this.alert("抱歉，未能找到与之对应的账号和密码！");
        // }
    }

    register() {
        if (this.user.password != this.user.confirmPassword) {
            this.alert("两次密码不一致，请重新确认！");
            this.processing = false;
            return;
        }
        //访问数据库，新增账号和密码
        this.processing = false;
        this.userData.push(this.user);
        this.alert("你的账号已成功创建！");
        this.isLoggingIn = true;
        // this.userService.register(this.user)
        //     .then(() => {
        //         this.processing = false;
        //         this.alert("Your account was successfully created.");
        //         this.isLoggingIn = true;
        //     })
        //     .catch(() => {
        //         this.processing = false;
        //         this.alert("Unfortunately we were unable to create your account.");
        //     });
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for APP NAME to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                //访问数据库更改密码

                // this.userService.resetPassword(data.text.trim())
                //     .then(() => {
                //         this.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                //     }).catch(() => {
                //         this.alert("Unfortunately, an error occurred resetting your password.");
                //     });
            }
        });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    alert(message: string) {
        return alert({
            title: "MES",
            okButtonText: "确定",
            message: message
        });
    }
}

