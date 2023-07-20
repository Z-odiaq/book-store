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
import { MatDialogModule } from '@angular/material/dialog';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { UserService } from './services/user.Service';
import { ViewBookComponent } from './view-book/view-book.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    FavoritesComponent,
    BooksComponent,
    PurchasedComponent,
    OrdersComponent,
    ManageBooksComponent,
    ViewBookComponent,
    CreateBookComponent,
    EditBookComponent,
    CreateUserComponent,
    ManageOrdersComponent,
    EditOrdersComponent,
    
    
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
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],

})
export class AppModule { }
