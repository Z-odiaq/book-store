import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.css'],
})
export class EditOrdersComponent implements OnInit {
  orders: any[] = []; // Replace 'any[]' with the actual type of your 'orders' array
  selectedOrder: any = null; // Replace 'any' with the actual type of your 'selectedOrder' object

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    // Fetch your orders data and assign it to the 'orders' array
    // Example data for demonstration
    this.selectedOrder = this.orderService.selectedOrder;
    this.getOrders();// Replace '...' with your actual order data
  }
  getOrders(): void {
    this.orderService.getOrdersByUserId().subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.log('Error fetching orders:', error);
      }
    );
  }
  // Function to select an order for editing
  selectOrder(order: any) {
    this.selectedOrder = order;
  }
  removeBook(bookId: string) {
    if (this.selectedOrder && this.selectedOrder.books) {
      const index = this.selectedOrder.books.findIndex((book: any) => book._id === bookId);
      if (index !== -1) {
        this.selectedOrder.books.splice(index, 1);
      }
    }
  }
  // Function to update the status of the selected order (you may need to modify this according to your API)

  update(): void {
    this.orderService.updateOrder(this.selectedOrder).subscribe(
      (response) => {
        window.confirm('The order has been updated.');
      },
      (error) => {
        console.log('Error updating order:', error);
        window.confirm('There was an error updating the order.');
      });
  }
}
