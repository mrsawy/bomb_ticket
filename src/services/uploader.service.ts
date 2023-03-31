import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  url = environment.BaseUrl;
  constructor(
    public http: HttpClient,
  ) { }
  uploadImage(file) {
    const fd = new FormData();
    fd.append("image", file);
    return this.http.post(this.url + "image/saveImages", fd);
  };


  removeImage(fileName) {
    return this.http.post(this.url + "image/delete", { fileName: fileName });
  }

}
