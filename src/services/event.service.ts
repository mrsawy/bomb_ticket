import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url = environment.BaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getAllEvents() {
    return this.http.get(this.url + 'event/all-event-with-carousel-data');
  }
  getOneEvents(id) {
    return this.http.get(this.url + 'event/event/' + id);
  }
  getDetail(id) {
    return this.http.get(this.url + 'event/get-detail/' + id);
  }
}
