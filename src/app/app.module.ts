import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BooksComponent } from './books/books.component';
import { PurchasedComponent } from './purchased/purchased.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrdersComponent } from './orders/orders.component';
import { FormsModule } from '@angular/forms';
import { OrderService } from './services/order.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    FavoritesComponent,
    BooksComponent,
    PurchasedComponent,
    OrdersComponent,
    PaymentDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [OrderService],
  bootstrap: [AppComponent],

})
export class AppModule { }
