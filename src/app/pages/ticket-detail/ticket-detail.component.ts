import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { DataService } from "../../../services/data.service";
import { EventService } from "../../../services/event.service";
import { MyWalletService } from "../../../services/my-wallet.service";

@Component({
  selector: "app-ticket-detail",
  templateUrl: "./ticket-detail.component.html",
  styleUrls: [
    "./ticket-detail.component.scss",
    "../../../vendor/styles/pages/projects.scss",
  ],
})
export class TicketDetailComponent implements OnInit {
  currentPage = 1;
  totalItems = 0;
  perPage = 10;
  lat = 0;
  lng = 0;
  customStyle = [
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];
  zoom = 18;
  ticket = [];
  ticketData = [];
  url = environment.BaseUrl;
  customMarker = {
    // url: "assets/vendor/img/truckMarker.png",
    scaledSize: {
      width: 33,
      height: 50,
    },
  };
  eventData: {
    dateTime: "";
    eventImg: "";
    locationImg: "",
    // lat: "";
    // lng: "";
    location: "";
    subtitle: "";
    termsAndCondition: "";
    title: "";
  };
  quantity = [0, 0, 0, 0];
  quantityData = {
    name: "",
    tickets: [],
    ticket_section: {
      id: 0,
      name: "",
      sellerId: null,
    },
    eventId: 0,
    id: 0,
    price: 0,
    sellerId: 0,
    ticketLength: 0,
    ticketPrice: 0,
    finalPrice: 0,
  };
  ticketSellerId: any;
  eventTicketArray = [];
  ticketArray = [];
  ordSortBy = "price";
  ordSortDesc = false;
  ordCurrentPage = 1;
  constructor(
    public eventServices: EventService,
    public activeRoute: ActivatedRoute,
    public modalService: NgbModal,
    public router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    let id = this.activeRoute.snapshot.params.id;
    this.getTicketPercentage();
    this.eventServices.getOneEvents(id).subscribe(
      (resp: any) => {
        this.eventData = resp;
        this.eventTicketArray = resp.sell_tickets;
        resp.sell_tickets.forEach((data) => {
          Object.assign(data, {
            TicketTier: data.ticket_section ? data.ticket_section.name : null,
            ticketAvailable: data.tickets.length ? (data.tickets.length - this.getSoldQty(data)) : null,
            ticketSold: data.tickets.length ? this.getSoldQty(data) : null,
          });
        });
        this.update();
        this.lat = parseFloat(resp.lat);
        this.lng = parseFloat(resp.lng);
      },
      (err) => { }
    );
  }


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
    let tax = price * (this.ticketTaxPercentage / 100);
    let finalPrice = price + tax;
    data = {
      tax: JSON.parse(tax.toFixed(2)),
      price: price.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    }
    return data;
  }


  sortTickets() {
    this.eventTicketArray.sort(function (a, b) {
      return (a.ticketAvailable) ? -1 : 1;
    });
    this.eventTicketArray.sort(function (a, b) {
      if (a.ticketAvailable) {
        return (a.price < b.price) ? -1 : 1;
      }
    });
  }


  getSoldQty(item) {
    let total = 0;
    if (item.tickets) {
      item.tickets.forEach(element => {
        if (element.status == 'sold') {
          total += 1;
        }
      });
    }
    return total;
  }

  getAvailableTickets() {
    let myArray = [];
    if (this.quantityData.tickets) {
      this.quantityData.tickets.forEach(element => {
        if (element.status == 'approved') {
          myArray.push(element);
        }
      });
    }
    return myArray;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    this.ticket = [];
    this.sortTickets();
    const data = this.eventTicketArray;
    // this.ordSort(data);
    this.totalItems = data.length;
    this.ticket = this.paginate(data);
  }

  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }
  // ordSetSort(key) {
  //   if (this.ordSortBy !== key) {
  //     this.ordSortBy = key;
  //     this.ordSortDesc = false;
  //   } else {
  //     this.ordSortDesc = !this.ordSortDesc;
  //   }
  //   this.ordCurrentPage = 1;
  //   this.update();
  // }
  // ordSort(data) {
  //   data.sort((a: any, b: any) => {
  //     a =
  //       typeof a[this.ordSortBy] === "string"
  //         ? a[this.ordSortBy].toUpperCase()
  //         : a[this.ordSortBy];
  //     b =
  //       typeof b[this.ordSortBy] === "string"
  //         ? b[this.ordSortBy].toUpperCase()
  //         : b[this.ordSortBy];
  //     if (a < b) {
  //       return this.ordSortDesc ? 1 : -1;
  //     }
  //     if (a > b) {
  //       return this.ordSortDesc ? -1 : 1;
  //     }
  //     return 0;
  //   });
  // }

  buyBtnReturn(sellerId) {
    let user = localStorage.getItem('user-ticket');
    let userData = JSON.parse(user);
    if (userData.id == sellerId) {
      return true;
    } else {
      return false;
    }
  }

  openModal(targetModal, item, index) {
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });

    this.quantityData = item;
    this.quantityData.finalPrice = item.price + (item.price * (this.ticketTaxPercentage / 100));
    this.quantityData.tickets.forEach((element) => {
      Object.assign(element, { isChecked: false });
    });
    // Object.assign(this.quantityData, { ticketLength: 1 });
    // Object.assign(this.quantityData, {
    //   ticketPrice: this.quantityData.price,
    // });
    // this.quantityData.tickets[0].isChecked = true;
    // this.ticketArray.push(this.quantityData.tickets[0]);


  }

  selectQuantity(qty) {
    let ind = qty - 1;
    this.quantityData.tickets.map((val) => (val.isChecked = false));
    this.quantityData.tickets[ind].isChecked =
      !this.quantityData.tickets[ind].isChecked;
    this.quantityData.ticketLength = ind + 1;
    this.quantityData.ticketPrice = (this.quantityData.price + (this.quantityData.price * (this.ticketTaxPercentage / 100))) * (ind + 1);
    this.ticketArray = [];
    this.quantityData.tickets.slice(-(ind + 1)).forEach((element, index) => {
      this.ticketArray.push(element);
    });
  }

  addMyInfoBtn() {
    this.modalService.dismissAll();
    let data = {
      eventDetail: this.eventData,
      ticketDetail: {
        name: this.quantityData.ticket_section.name,
        ticketLength: this.quantityData.ticketLength,
        ticketPrice: this.quantityData.finalPrice,
        ticket: this.ticketArray,
        sellerId: this.ticketSellerId,
      },
    };
    localStorage.setItem("eventDetails", JSON.stringify(data));
    this.router.navigate(["/check-out"]);
  }
}
