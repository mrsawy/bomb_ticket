import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  changePassword(id, data) {
    return this.http.post(this.url + 'user/change-password/' + id, data);
  }
  updateProfile(id, data) {
    return this.http.post(this.url + 'user/update-user/' + id, data);
  }
  editProfile(id, data) {
    return this.http.post(this.url + 'user/update-user' + id, data);
  }
  contactUs(data) {
    return this.http.post(this.url + 'complaintSuggestion/create', data);
  }

  markDisclaimer(userId) {
    return this.http.post(this.url + 'user/mark-disclaimer/' + userId, null);
  }

}
