import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerShipService {
  url = environment.BaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getAllPartnerShip() {
    return this.http.get(this.url + 'partnerShip/all-partnerShip');
  }
}
