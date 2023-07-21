import { Component, OnInit } from '@angular/core';
import { EditCouponComponent } from '../edit-coupon/edit-coupon.component';
import { CreateCouponComponent } from '../create-coupon/create-coupon.component';
import { Coupon } from '../models/coupon';
import { CouponService } from '../services/CouponService';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-manage-coupon',
  templateUrl: './manage-coupon.component.html',
  styleUrls: ['./manage-coupon.component.css']
})
export class ManageCouponComponent implements OnInit {
  coupons: Coupon[] = [];

  constructor(private couponService: CouponService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllCoupons();
  }


  getAllCoupons(): void {
    this.couponService.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
    });
  }


  createCoupon() {
    const dialogRef = this.dialog.open(CreateCouponComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }

  editCoupon(coupon: Coupon) {
    this.couponService.selectedCoupon = coupon;
    const dialogRef = this.dialog.open(EditCouponComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }

  deleteCoupon(coupon: any) {
    this.couponService.deleteCoupon(coupon).subscribe(deletedCoupon => {
      console.log('Deleted Coupon:', deletedCoupon);
      this.getAllCoupons();
    });
  }
}
