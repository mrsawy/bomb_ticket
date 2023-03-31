import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketSectionService {
  url = environment.BaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getTicketSectionByEvents(id) {
    return this.http.get(this.url + 'ticketSection/all-ticket-section-event/' + id);
  }
}
