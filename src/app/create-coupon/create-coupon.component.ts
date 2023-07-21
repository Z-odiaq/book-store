import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CouponService } from '../services/CouponService';
import { Coupon } from '../models/coupon';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css']
})
export class CreateCouponComponent implements OnInit {
  newCoupon: Coupon = {
    code: '',
    discountPercentage: 0,
    expiryDate: '',
    maxUses: 1
  }  as Coupon;

  constructor(public dialogRef: MatDialogRef<CreateCouponComponent>, private couponService: CouponService) { }

  ngOnInit(): void {
  }

  createCoupon() {
    // Implement create coupon logic here
    console.log('New Coupon:', this.newCoupon);
    this.couponService.createCoupon(this.newCoupon).subscribe(createdCoupon => {
      if (createdCoupon) {
        console.log('Updated Coupon:', createdCoupon);
        window.confirm('The coupon has been created.');
      }else{
        console.log('Coupon not updated', createdCoupon);
        window.confirm('There was an error creating the coupon.');
      }
      this.dialogRef.close();
    });


    this.newCoupon = {
      code: '',
      discountPercentage: 0,
      expiryDate: '',
      maxUses: 1
    }  as Coupon;
  }
}
