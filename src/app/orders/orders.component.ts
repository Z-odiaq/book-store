import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  fieldOptions = ['Order Number', 'Customer Name', 'Status'];
  selectedField: any;

  constructor(private http: HttpClient, private orderService: OrderService) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  fetchOrders() {
    this.http.get<Order[]>('http://127.0.0.1:3000/api/books').subscribe(
      (response) => {
        //log legnth of response
        console.log('Number of books:', response.length);
        this.orders = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  searchOrders() {
    this.filteredOrders = this.orders.filter((order) => {
      if (!this.searchTerm) {
        return true; // Show all orders if search term is empty
      }
  
      // Perform case-insensitive search based on the selected field
      const searchTermLower = this.searchTerm.toLowerCase();
      if (this.selectedField === 'Order Number') {
        return order.number.toLowerCase().includes(searchTermLower);
      } else if (this.selectedField === 'Customer Name') {
        // Assuming the customer name is stored in the 'user' field of the order
       // return order.user.name.toLowerCase().includes(searchTermLower);
      } else if (this.selectedField === 'Status') {
        return order.status.toLowerCase().includes(searchTermLower);
      }
  
      return false; // Invalid field option
    });
  }
  
}
