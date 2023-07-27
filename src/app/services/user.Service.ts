import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    admin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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

    registerUser(user: User): Observable<User> {
        const url = 'http://127.0.0.1:3000/api/register';
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
      
        return this.http.post<User>(url, user, httpOptions).pipe(
          catchError(error => {
            // Handle the error here

            console.error('Error occurred:', error.error.error);
            // You can customize the error message here
            const errorMessage = 'An error occurred. Please try again later.';
            // Show the error message in an alert box
            alert(error.error.error);
            // Re-throw the error so it can be handled by the subscriber as well
            return throwError(errorMessage);
          })
        );
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
    disconnect(): void {
        localStorage.removeItem('token');
        this.user = {} as User;
        this.token = '';
        this.favoriteBadgeCountSubject.next(0);
        this.loggedInSubject.next(false);
        this.admin.next(false);
        //reload the page
        window.location.reload();
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://127.0.0.1:3000/api/users');
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>('http://127.0.0.1:3000/api/users/' + user._id, user);
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete<User>('http://127.0.0.1:3000/api/users/' + userId);
    }
}
