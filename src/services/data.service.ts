import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  getTicketPercentage() {
    return this.http.get(this.url + 'admin/get-percentage');
  }

}
