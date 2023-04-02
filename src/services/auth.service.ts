  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) {}
  
  login(data) {
    return this.http.post(this.url + 'user/sign-in', data);
  }
  register(data) {
    return this.http.post(this.url + 'user/register', data);
  }
  forgot_password(data) {
    return this.http.post(this.url + 'user/forgot-password', data);
  }
  update_user_password(id, data) {
    return this.http.post(this.url + 'user/update-password/' + id, data);
  }

  isUserExist(data){
    return this.http.post(this.url + 'user/is-user-exist' ,data);

  }

  sendOtp(data){
    console.log(`sending the otp now ...`);
    
    return this.http.post('http://localhost:3000/user/send-otp',data);

  }

  verifyOtp(data){
    return this.http.post('http://localhost:3000/user/verify-otp' ,data);

  }
}
