import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { EventService } from "../../../services/event.service";

@Component({
  selector: 'app-ticket-detail-new',
  templateUrl: './ticket-detail-new.component.html',
  styleUrls: ['./ticket-detail-new.component.scss',
    "../../../vendor/styles/pages/projects.scss",]
})
export class TicketDetailNewComponent implements OnInit {

  constructor(
    public eventServices: EventService,
    public activeRoute: ActivatedRoute,
    public modalService: NgbModal,
    public router: Router,
    private dataService: DataService,
  ) { }

  url = environment.BaseUrl;
  eventData: any;
  eventTickets = [];
  allTickets = [];
  ticketData: any;
  purchaseData = {
    eventId: null,
    sellerId: null,
    ticket_section: null,
    event: null,
    price: 0,
    qty: 0,
    finalPrice: 0,
    tickets: [],
  }

  ngOnInit() {
    let id = this.activeRoute.snapshot.params.id;
    this.getTicketPercentage();
    this.eventServices.getDetail(id).subscribe((resp: any) => {
      this.eventData = resp.event;
      this.eventTickets = resp.eventTickets;
      this.update();
    });
  }

  @ViewChild('cannotPurchaseDialog') cannotPurchaseDialog: any;
  @ViewChild('unknownBuyDialog') unknownBuyDialog: any;


  ticketTaxPercentage = 0;


  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    });
  }


  priceReturn(price) {
    let data = {
      tax: 0,
      price: 0,
      finalPrice: 0,
    }
    if (price) {
      let tax = price * (this.ticketTaxPercentage / 100);
      let finalPrice = price + tax;
      data = {
        tax: JSON.parse(tax.toFixed(2)),
        price: price.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
      }
    }
    return data;
  }


  buyTicket(content, item) {
    let user = localStorage.getItem('user-ticket');
    if (user) {
      let userData = JSON.parse(user);
      if (userData.id == item.sellerId) {
        this.cannotPurchaseDialog.show();
      } else {
        this.ticketData = item;
        this.purchaseData = {
          eventId: item.eventId,
          sellerId: item.sellerId,
          ticket_section: item.ticket_section,
          event: this.eventData,
          price: this.priceReturn(item.price).finalPrice,
          qty: 0,
          finalPrice: 0,
          tickets: [],
        };
        this.modalService.open(content, {
          centered: true, size: "sm", backdrop: "static",
        });
      }
    } else {
      this.unknownBuyDialog.show();
    }
  }

  openLoginModal(content) {
    this.modalService.open(content);
  }



  selectQuantity(qty) {
    this.purchaseData.tickets = [];
    this.purchaseData.qty = qty;
    this.purchaseData.finalPrice = qty * this.priceReturn(this.ticketData.price).finalPrice;
    for (let i = 0; i < qty; i++) {
      this.purchaseData.tickets.push(this.ticketData.tickets[i]);
    }
  }


  onContinue() {
    this.modalService.dismissAll();
    let data = {
      eventDetail: this.eventData,
      ticketDetail: {
        name: this.purchaseData.ticket_section.name,
        sellerId: this.purchaseData.sellerId,
        ticket: this.purchaseData.tickets,
        ticketLength: this.purchaseData.qty,
        ticketPrice: this.purchaseData.price,
      },
    }
    localStorage.setItem("eventDetails", JSON.stringify(data));
    this.router.navigate(["/check-out"]);
  }




  // Sorting and filtration
  currentPage = 1;
  totalItems = 0;
  perPage = 10;
  sortTickets() {
    this.eventTickets.sort(function (a, b) {
      return (a.approvedTickets) ? -1 : 1;
    });
    this.eventTickets.sort(function (a, b) {
      if (a.approvedTickets) {
        return (a.price < b.price) ? -1 : 1;
      }
    });
  }
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    this.allTickets = [];
    this.sortTickets();
    const data = this.eventTickets;
    this.totalItems = data.length;
    this.allTickets = this.paginate(data);
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }

}
