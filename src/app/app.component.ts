import { Component, Inject, OnInit } from '@angular/core';
import { CartService } from './services/CartService';
import { UserService } from './services/user.Service';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartBadgeCount: number = 0;
  FavoritesBadgeCount: number = 0;

  title = 'Bookstore';

  constructor(private cartService: CartService, private dialog: MatDialog, @Inject(UserService) public userService: UserService) { }

  ngOnInit() {
    this.cartService.getCartBadgeCount().subscribe((count) => {
      this.cartBadgeCount = count;
    });
    this.userService.getFavoritesBadgeCount().subscribe((count) => {
      this.FavoritesBadgeCount = count;
    });
    this.cartService.loadCart();
  }

  openRegister() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
    });
    //close dialog if userService is logged in

    if (this.userService.loggedInSubject.subscribe((loggedIn) => {
      if (loggedIn) {

        dialogRef.close();
      }
    })) 
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed:', result);

      });
    }
  }
