import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coupon } from '../models/coupon';
import { CouponService } from '../services/CouponService';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.css']
})
export class EditCouponComponent implements OnInit {

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public couponService: CouponService
  ) { }

  ngOnInit(): void {

  }



  updateCoupon(): void {
    this.couponService.updateCoupon().subscribe(updatedCoupon => {
      if (updatedCoupon) {
        console.log('Updated Coupon:', updatedCoupon);
        window.confirm('The Coupon has been updated.');
      }else{
        console.log('Coupon not updated', updatedCoupon);
        window.confirm('There was an error updating the coupon.');
      }

    });
  }
}
