import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

//import user
import { User } from '../models/user';
@Injectable({
    providedIn: 'root'
})

export class UserService {

    user: User = {} as User;
    token: string = '';
    email = '';
    password = '';
    admin : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    firstname = '';
    lastname = '';
    favoriteBadgeCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    errorMsg = '';
    constructor(private http: HttpClient) { }

    onInit() {
        this.fetchUser();
    }

    fetchUser() {
        const token = this.getToken();
        if (!token) {
            return;
        }
        fetch('http://127.0.0.1:3000/api/users/me', {
            headers: {
                token: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.user = data;
                this.favoriteBadgeCountSubject.next(data.favorites.length);

            });
    }

    registerUser() {
        this.errorMsg = '';
        fetch('http://127.0.0.1:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email, password: this.password, firstname: this.firstname, lastname: this.lastname }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.error) {
                    this.errorMsg = data.error;
                    return;
                }
                localStorage.setItem('token', data.token);
                this.user = data.user;
                this.token = data.token;
                this.favoriteBadgeCountSubject.next(data.user.favorites.length);
                this.loggedInSubject.next(true);
                if (data.user.role === 'admin') {
                    this.admin.next(true);
                }
            })
            .catch((err) => {
                this.errorMsg = err;
                console.log(err);
            })


    }

    login() {
        fetch('http://127.0.0.1:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email, password: this.password }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.error) {
                    const confirmDelete = window.confirm(data.error);
                    return;
                }
                localStorage.setItem('token', data.token);
                this.user = data.user;
                this.token = data.token;
                this.favoriteBadgeCountSubject.next(data.user.favorites.length);
                this.loggedInSubject.next(true);
                if (data.user.role === 'admin') {
                    this.admin.next(true);

                }
            }).catch((err) => {
                //show alert error
                const confirmDelete = window.confirm(err);
                console.log(err);
            });
    }

    getFavoritesBadgeCount(): Observable<number> {
        return this.favoriteBadgeCountSubject.asObservable();
        //return calculated count of favorites
    }

    getToken(): string {
        return localStorage.getItem('token') || '';
    }

}
