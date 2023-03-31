import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = environment.BaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getAllOrder(id) {
    return this.http.get(this.url + 'order/order-user/' + id);
  }
  getSellerOrder(id) {
    return this.http.get(this.url + 'order/order-seller/' + id);
  }
  createOrder(data) {
    return this.http.post(this.url + 'order/create', data);
  }
}
