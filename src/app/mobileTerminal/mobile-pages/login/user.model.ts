export class User {
    email: string;
    password: string;
    confirmPassword: string;

    constructor(email?:string,passwork?:string,confirmPassword?:string){
        this.email = email;
        this.password = passwork;
        this.confirmPassword = confirmPassword;
    };
}
