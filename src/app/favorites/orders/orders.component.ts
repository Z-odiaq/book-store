import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.Service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient, private userService: UserService) { }

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
}
