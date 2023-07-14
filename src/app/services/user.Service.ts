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
    admin = true;
    favoriteBadgeCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
                localStorage.setItem('token', data.token);
                this.user = data.user;
                this.token = data.token;
                this.favoriteBadgeCountSubject.next(data.user.favorites.length);

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
