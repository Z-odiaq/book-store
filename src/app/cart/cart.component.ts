import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/CartService'; // Replace with the actual path to your CartService
import { Book } from '../models/book'; // Replace with your actual cart item model
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { UserService } from '../services/user.Service';
import { BookService } from '../services/book.service';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  stripe: Stripe | null = null;
  paymentHandler: any = null;

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
  stripeAPIKey: string = '';

  constructor(private http: HttpClient, private cartService: CartService, public userService: UserService, public bookService: BookService,private dialog: MatDialog,) { 
    this.loadStripeInstance();

  }
  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    this.fetchfavorites();
    this.fetchLatests();
    this.fetchTopBooks();
    this.fetchTopRated();
    this.loadStripeInstance();
    this.invokeStripe();
    this.stripeAPIKey = environment.stripePublishableKey;
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
  
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
  
      window.document.body.appendChild(script);
    }
  }


  async loadStripeInstance() {
    this.stripe = await loadStripe(this.stripeAPIKey);
  }

  openPaymentDialog(): void {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Stripe token generated!');
      },
    });
    paymentHandler.open({
      
      name: 'Confirm purchase',
      description: '3 widgets',
      amount: this.cartService.getTotal() * 100,
    });
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
