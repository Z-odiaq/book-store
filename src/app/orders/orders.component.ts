import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.Service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient, private userService: UserService, private orderService: OrderService,) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<any[]>('http://127.0.0.1:3000/api/orders/user/'+ this.userService.user._id ).subscribe(
      (response) => {
        this.orders = response;
      },
      (error) => {
        console.log('Error fetching orders:', error);
      }
    );
  }

  cancelOrder(order: Order): void {
    order.status = 'Cancelled';
    this.orderService.updateOrder(order).subscribe(
      (response) => {
        window.confirm('The order has been cancelled.');
      },
      (error) => {
        console.log('Error updating order status:', error);
        window.confirm('There was an error updating the order.');
      });
  }
  RevalidateOrder(order: Order): void {
    order.status = 'Confirmed';
    this.orderService.updateOrder(order).subscribe(
      (response) => {
        window.confirm('The order has been Re-Confirmed.');
      },
      (error) => {
        console.log('Error updating order status:', error);
        window.confirm('There was an error updating the order.');
      });
  }
}
