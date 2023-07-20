
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { MatDialog } from '@angular/material/dialog';
import { EditOrdersComponent } from '../edit-orders/edit-orders.component';
@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];;
  filteredOrders: any[] = []; // Array to hold filtered orders
  statusFilter: string = ''; // Property to hold the selected status filter
  sortOption: string = 'date'; // Property to hold the selected sort option ('date' or 'total')

  constructor(private orderService: OrderService, private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getOrders();

  }

  getOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.filteredOrders = this.orders.slice();

      },
      (error) => {
        console.log('Error fetching orders:', error);
      }
    );
  }

  updateOrderStatus(order: Order): void {
    this.orderService.updateOrder(order).subscribe(
      (response) => {
        console.log('Order status updated:', response);
      },
      (error) => {
        console.log('Error updating order status:', error);
      }
    );
  }

  editOrder(order : Order): void {
this.orderService.selectedOrder = order;
    const dialogRef = this.dialog.open(EditOrdersComponent, {
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // Handle the dialog close event if needed
        console.log('Dialog closed:', result);
      });
    
  }
  filterByStatus(status: string) {
    this.statusFilter = status;
    if (status === '') {
      this.filteredOrders = this.orders.slice(); // No filter, show all orders
    } else {
      this.filteredOrders = this.orders.filter((order) => order.status === status);
    }
    this.sortOrders(); // Apply sorting after filtering
  }

  // Function to sort orders by date or total
  sortOrders() {
    if (this.sortOption === 'date') {
      this.filteredOrders.sort((a, b) => a.createdAt - b.createdAt); // Sort by date (ascending)
    } else if (this.sortOption === 'total') {
      this.filteredOrders.sort((a, b) => a.total - b.total); // Sort by total (ascending)
    }
  }
  confirmOrder(order: Order): void {
    order.status = 'Confirmed';
    this.orderService.updateOrder(order).subscribe(
      (response) => {
        window.confirm('The order has been confirmed.');
      },
      (error) => {
        console.log('Error updating order status:', error);
        window.confirm('There was an error updating the order.');
      });
  }

  rejectOrder(order: Order): void {
    order.status = 'Rejected';
    this.orderService.updateOrder(order).subscribe(
      (response) => {
        window.confirm('The order has been rejected.');
      },
      (error) => {
        console.log('Error updating order status:', error);
        window.confirm('There was an error updating the order.');
      });
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
}
