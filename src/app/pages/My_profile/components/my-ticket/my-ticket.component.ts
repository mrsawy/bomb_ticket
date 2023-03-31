import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../../../../../environments/environment";
import { DataService } from "../../../../../services/data.service";
import { NotificationService } from "../../../../../services/notification.service";
import { TicketService } from "../../../../../services/ticket.service";
import { UserDataService } from "../../../../../services/user-data.service";

@Component({
  selector: "app-my-ticket",
  templateUrl: "./my-ticket.component.html",
  styleUrls: [
    "./my-ticket.component.scss",
    "../../../../../vendor/libs/spinkit/spinkit.scss",
  ],
})
export class MyTicketComponent implements OnInit {

  value: any;
  activeTabTicket = "Pending";
  approvedTicket = [];
  pendingTicket = [];
  rejectedTicket = [];
  soldTicket = [];
  loading = false;
  Id;
  url = environment.BaseUrl;

  constructor(
    public myTool: NotificationService,
    public ticketService: TicketService,
    private ngbModal: NgbModal,
    private userDataService: UserDataService,
    private dataService: DataService,
  ) { }

  parentTicketId: any;
  childTicketId: any;
  sellTicketPrice: any;
  sellTicketIndex: any;
  ticketTaxPercentage = 0;

  ngOnInit() {
    this.loading = true
    this.loading = false;
    this.getTicketPercentage();
    this.Id = JSON.parse(localStorage.getItem("userId-ticket"));
    this.ticketService.getAllTicket(this.Id).subscribe((resp: any) => {
      this.approvedTicket = resp.approvedTicket;
      this.pendingTicket = resp.pendingTicket;
      this.rejectedTicket = resp.rejectedTicket;
      this.soldTicket = resp.soldTicket;
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    })
  }

  priceReturn(price) {
    let data = {
      tax: null,
      price: null,
      finalPrice: null,
    }
    let tax = price * (this.ticketTaxPercentage / 100);
    let finalPrice = price + tax;
    data = {
      tax: tax.toFixed(2),
      price: price.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    }
    return data;
  }


  tabChangeTicket(active) {
    this.activeTabTicket = active;
    this.ngOnInit();
  }

  isArLng() {
    return this.userDataService.isLngAr();
  }

  editTicket(content, item, ind) {
    this.sellTicketIndex = ind;
    if (item) {
      this.childTicketId = item.id;
      if (item.sell_ticket) {
        this.parentTicketId = item.sell_ticket.id;
        this.sellTicketPrice = item.sell_ticket.price;
      }
    }
    this.ngbModal.open(content, { windowClass: 'center-modal-div' });
  }

  deleteTicket(item, ind) {
    this.childTicketId = item.id;
    this.parentTicketId = item.sell_ticket.id;
    this.sellTicketIndex = ind;
  }

  onUpdateTicket() {
    let data = {
      price: this.sellTicketPrice,
    }
    this.ticketService.updateTicket(this.parentTicketId, data).subscribe((resp: any) => {
      this.myTool.showMyAlert('success', resp.message);
      this.ngbModal.dismissAll();
      this.update(true);
    }, err => {
      this.myTool.showMyAlert('danger', err.error.message);
    })
  }


  onDeleteTicket() {
    let data = {
      ticketId: this.childTicketId,
      sellTicketId: this.parentTicketId,
    }
    this.ticketService.deleteTicket(data).subscribe((resp: any) => {
      this.myTool.showMyAlert('success', resp.message);
      this.update(false);
    }, err => {
      this.myTool.showMyAlert('danger', err.error.message);
    })
  }

  update(type) {
    if (this.activeTabTicket == "Pending") {
      if (type) {
        this.pendingTicket.forEach((item, ind) => {
          if (item.sell_ticket.id == this.parentTicketId) {
            this.pendingTicket[ind].sell_ticket.price = this.sellTicketPrice;
          }
        })
        // this.pendingTicket[this.sellTicketIndex].sell_ticket.price = this.ticketTaxPriceReturn();
      } else {
        this.pendingTicket.splice(this.sellTicketIndex, 1);
      }
    } else if (this.activeTabTicket == "approved") {
      if (type) {
        this.approvedTicket.forEach((item, ind) => {
          if (item.sell_ticket.id == this.parentTicketId) {
            this.approvedTicket[ind].sell_ticket.price = this.sellTicketPrice;
          }
        })
        // this.approvedTicket[this.sellTicketIndex].sell_ticket.price = this.ticketTaxPriceReturn();
      } else {
        this.approvedTicket.splice(this.sellTicketIndex, 1);
      }
    } else if (this.activeTabTicket == "Rejected") {
      if (type) {
        this.rejectedTicket.forEach((item, ind) => {
          if (item.sell_ticket.id == this.parentTicketId) {
            this.rejectedTicket[ind].sell_ticket.price = this.sellTicketPrice;
          }
        })
        // this.rejectedTicket[this.sellTicketIndex].sell_ticket.price = this.ticketTaxPriceReturn();
      } else {
        this.rejectedTicket.splice(this.sellTicketIndex, 1);
      }
    }
  }


}
