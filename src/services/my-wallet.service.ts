import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MyWalletService {
  url = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  getAllWallet(id) {
    return this.http.get(this.url + "withdraw/my-wallet-data/" + id);
  }
  WalletUpdate(id, data) {
    return this.http.post(this.url + "withdraw/update/" + id, data);
  }
  getPaymentUrl(data) {
    return this.http.post(this.url + "pay", data);
  }
  getPaymentStatus(data) {
    return this.http.post(this.url + "checkPaymentStatus", data);
  }
  getPaymentMethods(data) {
    return this.http.post(this.url + "get-payment-options", data);
  }
  initiatePayment() {
    return this.http.get(this.url + "initiate-session");
  }
}
