import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { PurchasedComponent } from './purchased/purchased.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component'; // Add this line
import { ManageBooksComponent } from './manage-books/manage-books.component';

import { ViewBookComponent } from './view-book/view-book.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageCouponComponent } from './manage-coupon/manage-coupon.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AuthGuard } from './auth.guard';



const routes: Routes = [
  { path: 'books', component: BooksComponent },
  { path: 'books/:id', component: ViewBookComponent },
{path:'login', redirectTo:'/books', pathMatch:'full'},
  { path: 'favorites', component: FavoritesComponent },
  { path: 'purchased', component: PurchasedComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/books', pathMatch: 'full' }, // Default route
  { path: 'orders', component: OrdersComponent }, // Add this line
  { path: 'manage-books', component: ManageBooksComponent, canActivate: [AuthGuard] },
  { path: 'manage-orders', component: ManageOrdersComponent, canActivate: [AuthGuard] },
  { path: 'manage-coupon', component: ManageCouponComponent, canActivate: [AuthGuard] },
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
