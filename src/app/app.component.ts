import { Component, Inject, OnInit } from '@angular/core';
import { CartService } from './services/CartService';
import { UserService } from './services/user.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartBadgeCount: number = 0;
  FavoritesBadgeCount : number = 0;

  title = 'Bookstore';

  constructor(private cartService: CartService, @Inject(UserService) public userService: UserService) {}

  ngOnInit() {
    this.cartService.getCartBadgeCount().subscribe((count) => {
      this.cartBadgeCount = count;
    });
    this.userService.getFavoritesBadgeCount().subscribe((count) => {
      this.FavoritesBadgeCount = count;
    });
    this.cartService.loadCart();
  }


}
