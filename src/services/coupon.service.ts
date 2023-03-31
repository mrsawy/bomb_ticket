import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  // checkCoupon(name) {
  //   return this.http.get(this.url + 'coupon/check-coupon/' + name);
  // }

  findCoupon(name) {
    let data = {
      name: name,
      userId: JSON.parse(localStorage.getItem('userId-ticket')),
    }
    return this.http.post(this.url + 'user-coupon/find-coupon', data);
  }

  getMyCoupons() {
    let userId = JSON.parse(localStorage.getItem('userId-ticket'));
    return this.http.get(this.url + 'user-coupon/get-user-coupons-with-user-coupon/' + userId);
  }
}
