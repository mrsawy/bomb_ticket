import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  url = environment.BaseUrl;

  isGuestUser() {
    return localStorage.getItem("user-ticket") ? true : false;
  }
  isLngAr() {
    if (localStorage.getItem("ticketLang")) {
      return localStorage.getItem("ticketLang") == "ar" ? true : false;
    }
  }

  checkBlockUnblockUser() {
    let userId = localStorage.getItem("userId-ticket");
    if (userId) {
      this.http.get(this.url + 'user/check-block-unblock/' + userId).subscribe((resp: any) => {
      }, err => {
        localStorage.removeItem("user-ticket");
        localStorage.removeItem("userId-ticket");
        this.router.navigateByUrl('/');
      })
    }
  }

  userReturner() {
    let user = localStorage.getItem('user-ticket');
    if (user) {
      return JSON.parse(user);
    }
  }
  getOneUser() {
    return this.http.get(this.url + 'user/one-user/' + this.userReturner().id);
  }
  getBankData() {
    return this.http.get(this.url + 'bank/get-by-user/' + this.userReturner().id);
  }

}
