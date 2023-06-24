import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/CartService'; // Replace with the actual path to your CartService
import { Book } from '../models/book'; // Replace with your actual cart item model
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Book[] = [];
  total: number = 0;

  latest: Book[] = [];
  topSellingBooks: Book[] = [];
  topRatedBooks: Book[] = [];
  favorites: Book[] = [];
  modal: Boolean = false;
  constructor(private http: HttpClient, private cartService: CartService, private dialog: MatDialog) { }


  openPaymentDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      // Dialog configuration options
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the dialog close event if needed
      console.log('Dialog closed:', result);
    });
  }


  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    this.fetchfavorites();
    this.fetchLatests();
    this.fetchTopBooks();
    this.fetchTopRated();
  }


  //applyCoupon
  applyCoupon(coupon: string) {
    console.log('Error applying coupon:', coupon);

    // this.http.post('http://127.0.0.1/api/coupons/apply', { coupon: coupon }).subscribe(
    //   (response) => {
    //     console.log('Coupon applied:', response);
    //     this.calculateTotal();
    //   },
    //   (error) => {
    //     console.log('Error applying coupon:', error);
    //   }
    // );
  }

  //get favorites books
  fetchfavorites() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books/favorites').subscribe(
      (response) => {
        this.favorites = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }
  // Add this in your component class

  //get latest books
  fetchLatests() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books/latest').subscribe(
      (response) => {
        this.latest = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  switchModel() {
    // Implement logic to activate the modal
    console.log('switchModel', this.modal);
    this.modal = !this.modal;
  }
  //get top selling books
  fetchTopBooks() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books/top-selling').subscribe(
      (response) => {
        this.topSellingBooks = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  //get top rated books
  fetchTopRated() {
    this.http.get<Book[]>('http://127.0.0.1:3000/api/books/top-rated').subscribe(
      (response) => {
        this.topRatedBooks = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }



  calculateTotal(): void {
    this.total = this.cartService.getTotal();
  }

  increaseQuantity(item: Book): void {
    item.quantity++;
    this.calculateTotal();
    this.cartService.updateCartBadgeCount();
  }

  decreaseQuantity(item: Book): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
      this.cartService.updateCartBadgeCount();
    }
  }

  removeItem(item: Book): void {
    const index = this.cartItems.findIndex((cartItem) => cartItem._id === item._id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotal();
      this.cartService.updateCartBadgeCount();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.total = 0;
    this.cartService.clearCart();
  }

  placeOrder(): void {
    // Show the order confirmation modal or proceed with the order
  }




  isFreeDelivery(): boolean {
    return this.total >= 100;
  }

  getProgressWidth(): string {
    const progress = (this.total / 100) * 100 < 100 ? (this.total / 100) * 100 : 100;
    return `${progress}%`;
  }

  getDeliveryStatus(): string {
    return this.isFreeDelivery() ? 'Yoopii! Free delivery!' : 'Reach 100$ for free delivery!';
  }

  addToCart(book: Book): void {
    const foundBook = this.cartItems.find((item) => item._id === book._id);
    if (foundBook) {
      foundBook.quantity += 1;
    } else {
      const bookCopy: Book = { ...book, quantity: 1 };
      this.cartItems.push(bookCopy);
    }
    this.cartService.updateCartBadgeCount();
  }


}
