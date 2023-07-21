
//generate coupon service
//ng g s services/CouponService
// Path: src\app\services\CouponService.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../models/coupon';
import { UserService } from './user.Service';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    private apiUrl = 'http://127.0.0.1:3000/api/coupons'; // Update with your API URL
    selectedCoupon: Coupon = {} as Coupon;
    Coupons: Coupon[] = [];
    constructor(private http: HttpClient, public userService: UserService) { }
    ngOnInit(): void {
        this.fetchCoupons();
    }

    fetchCoupons() {
        this.http.get<Coupon[]>(this.apiUrl).subscribe( 
            (response) => {
                this.Coupons = response;
            }
        );
    }

    getCoupons(): Observable<Coupon[]> {
        return this.http.get<Coupon[]>(this.apiUrl);
    }

    updateCoupon(): Observable<Coupon> {
        return this.http.put<Coupon>(`${this.apiUrl}/${this.selectedCoupon._id}`, this.selectedCoupon);
    }

    deleteCoupon(coupon: Coupon): Observable<Coupon> {
        return this.http.delete<Coupon>(`${this.apiUrl}/${coupon._id}`);
    }

    createCoupon(coupon: Coupon): Observable<Coupon> {
        return this.http.post<Coupon>(this.apiUrl, coupon);
    }

    getCouponById(id: string): Observable<Coupon> {
        return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
    }

    getCouponByCode(code: string): Observable<Coupon> {
        return this.http.get<Coupon>(`${this.apiUrl}/code/${code}`);
    }

    getCouponsByUserId(): Observable<Coupon[]> {
        return this.http.get<Coupon[]>(`${this.apiUrl}/user/${this.userService.user._id}`);
    }

    getCouponsByBookId(bookId: string): Observable<Coupon[]> {
        return this.http.get<Coupon[]>(`${this.apiUrl}/book/${bookId}`);
    }

}