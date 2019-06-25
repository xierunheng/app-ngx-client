// The following is a sample implementation of a backend service using Progress Kinvey (https://www.progress.com/kinvey).
// Feel free to swap in your own service / APIs / etc here for your own apps.
import { Injectable } from "@angular/core";


@Injectable()
export class UserService {

    private static CURRENT_USER: string = '';

    static isUserLoggedIn() {
        console.log(!!this.CURRENT_USER);
        return !!this.CURRENT_USER;
    }

    static setCurrentUser(name){
        this.CURRENT_USER = name;
    }
}
