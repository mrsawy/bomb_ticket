import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) {}
  
  createBank(data) {
    return this.http.post(this.url + 'bank/create' ,data);
  }
  updateBank(id,data) {
    return this.http.post(this.url + 'bank/update/'+ id ,data);
  }
  checkBankInfo(id) {
    return this.http.get(this.url + 'bank/check-bank-info/' + id);
  }
}
