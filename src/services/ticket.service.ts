import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  url = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  getAllTicket(id) {
    return this.http.get(this.url + 'ticket/all-ticket-pending-approved-rejected/' + id);
  }
  createTicket(data) {
    console.log(data);
    
    return this.http.post(  'http://localhost:3000/ticket/create',data);
  }
  updateTicket(ticketId, ticketData) {
    return this.http.post(this.url + 'ticket/update/' + ticketId, ticketData);
  }
  deleteTicket(ticketData) {
    return this.http.post(this.url + 'ticketImg/del-ticket', ticketData);
  }
}
