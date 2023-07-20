import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { UserService } from './user.Service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:3000/api/orders'; // Update with your API URL
  selectedOrder : Order = {} as Order;
  Orders : Order[] = [];
  constructor(private http: HttpClient, public userService: UserService) {}
  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<Order[]>('http://127.0.0.1:3000/api/orders').subscribe(
      (response) => {
        this.Orders = response;
      },
      (error) => {
        console.log('Error fetching orders:', error);
      }
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order._id}`, order);
  }

  deleteOrder(order: Order): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/${order._id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${this.userService.user._id}`);
  }


}
