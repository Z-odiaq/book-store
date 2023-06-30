import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/CartService'; // Replace with the actual path to your CartService
import { Book } from '../models/book'; // Replace with your actual cart item model
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { UserService } from '../services/user.Service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Book[] = [];
  total: number = 0;
  couponTotal: number = 0;
  latest: Book[] = [];
  topSellingBooks: Book[] = [];
  topRatedBooks: Book[] = [];
  favorites: Book[] = [];
  modal: Boolean = false;
  couponError: String = '';
  expiry: String = '';
  couponPercentage = 0;

  constructor(private http: HttpClient, private cartService: CartService, public userService: UserService, public bookService: BookService,private dialog: MatDialog,) { }


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
    //console.log('Error applying coupon:', coupon);

    //GET coupon and add the code to the params


    fetch(`http://127.0.0.1:3000/api/coupons/code/${coupon}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': this.userService.getToken(),
      }
    }).then((response) => {
      if (response.status !== 200) {
        response.json().then((data) => {
          console.log('Error applying coupon:', data);
          this.couponError = data.error;
          this.cartService.setCoupon(null);
          this.total = this.cartService.getTotal();
          this.couponPercentage = 0;
          this.couponTotal = 0;
          this.expiry = '';

          return;
        });

      }
      return response.json(); // Parse the response as JSON
    })
      .then((data) => {
        console.log('Coupon applied:', data);
        this.couponPercentage = data.percentage.toFixed(2);
        this.couponTotal = this.total - (this.total * (data.percentage / 100));
        this.expiry = data.expiryDate.split('T')[0];
        this.couponError = '';
        data.code = coupon;
        this.cartService.setCoupon(data);
      })
      .catch((error) => {
        console.log('Error applying coupon:', error);
        this.couponError = error.merroressage;

      });


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
