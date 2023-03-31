import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  url = environment.BaseUrl;
  constructor(public http: HttpClient) {}
  
  sellerDashboard(id) {
    return this.http.get(this.url + "user/get-dashBoard-data-by-seller/" + id);
  }
}
