import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartBadgeCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  //cartBadgeCount$ = this.cartBadgeCountSubject.asObservable();
  private cartItems: Book[] = [];
  coupon: any;

  setCoupon(data: any) {
    this.coupon = data;
  }
  getCoupon() {
    return this.coupon;
  }
  getCartItems(): Book[] {
    return this.cartItems;
  }
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price , 0);
  }
  addToCart(book: Book): void {
    const foundBook = this.cartItems.find((item) => item._id === book._id);
    if (foundBook) {
      return;
    } else {
      const bookCopy: Book = { ...book  };
      this.cartItems.push(bookCopy);
    }
    this.updateCartBadgeCount();
  }

  removeFromCart(book: Book): void {
    const foundBook = this.cartItems.find((item) => item._id === book._id);
    if (foundBook) {
      foundBook.quantity -= 1;
      if (foundBook.quantity === 0) {
        this.cartItems = this.cartItems.filter((item) => item._id !== book._id);
      }
    }
    this.updateCartBadgeCount();
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.updateCartBadgeCount();
  }



  getCartBadgeCount(): Observable<number> {
    return this.cartBadgeCountSubject.asObservable();
  }

  updateCartBadgeCount(): void {
    const count = this.cartItems.length;
    this.cartBadgeCountSubject.next(count);
    this.saveCart();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  loadCart(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems = JSON.parse(cart);
      this.updateCartBadgeCount();
    }
  }


}
