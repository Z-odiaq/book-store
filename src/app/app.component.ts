import { Component, OnInit } from '@angular/core';
import { CartService } from './services/CartService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartBadgeCount: number = 0;
  title = 'Bookstore';
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartBadgeCount().subscribe((count) => {
      this.cartBadgeCount = count;
    });
  }
}
