import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../services/CartService';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';
loading: boolean = false;

  constructor(public  cartService: CartService, public dialogRef: MatDialogRef<PaymentDialogComponent>) { }
  processPayment(): void {
    // Perform payment processing logic here api
    this.loading = true;
    setTimeout(() => {
      this.loading = false; // Hide the loading indicator after 3s
    }, 3000);
    //make api call to process payment
    fetch('http://127.0.0.1:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cardNumber: this.cardNumber,
        expiryDate: this.expiryDate,
        cvv: this.cvv,
        cardholderName: this.cardholderName,
        books : this.cartService.getCartItems(),
        total: this.cartService.getTotal()
      })
    }).then((response) => {
      console.log('Payment processed:', response);

      // Close the dialog, return true
      this.dialogRef.close(true);
    }).catch((error) => {
      console.log('Payment failed:', error);

      // Close the dialog, return false
      this.dialogRef.close(false);
    });
  }

  ngOnInit(): void {
  }


  onCancel(): void {
    // Close the dialog without performing any action
    this.dialogRef.close();
  }

}
