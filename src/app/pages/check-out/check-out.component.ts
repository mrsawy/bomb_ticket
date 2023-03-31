import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MyWalletService } from "./../../../services/my-wallet.service";
import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CouponService } from "../../../services/coupon.service";
import { NotificationService } from "../../../services/notification.service";
import { OrderService } from "../../../services/order.service";
import { UserDataService } from "../../../services/user-data.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrls: [
    "./check-out.component.scss",
    "../../../vendor/libs/ngx-sweetalert2/ngx-sweetalert2.scss",
  ],
})
export class CheckOutComponent implements OnInit {
  eventData = {
    eventDetail: {
      createdAt: "",
      dateTime: "",
      eventImg: "",
      id: 0,
      lat: "",
      lng: "",
      location: "",
      title: "",
      subtitle: "",
      termsAndCondition: "",
      sell_tickets: [],
    },
    ticketDetail: {
      name: "",
      ticketLength: 0,
      ticketPrice: 0,
      ticket: [],
    },
  };
  coupon = true;
  couponCode;
  discountTotalPrice;
  couponData = {
    id: "",
    limit: "",
    name: "",
    percentOff: "",
  };
  orderData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    quantity: 0,
    price: 0,
    userId: 0,
    sellerId: 0,
    // couponId: 0,
    order: [],
    discount: 0,
    orderAmount: 0,
    userCouponId: null,
  };
  login = false;
  dataSuccess: any;
  dataError: any;
  dataCheckOut: any;
  constructor(
    public location: Location,
    public couponService: CouponService,
    public orderService: OrderService,
    public myTool: NotificationService,
    public userDataService: UserDataService,
    public router: Router,
    public myWalletService: MyWalletService,
    public translateService: TranslateService,
    public ngbModal: NgbModal,
    private http: HttpClient,
    private dataService: DataService,
  ) {
    translateService.get("dataSuccess").subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get("dataError").subscribe((resp: any) => {
      this.dataError = resp;
    });
    translateService.get("checkOut").subscribe((resp: any) => {
      this.dataCheckOut = resp;
      this.dialogOptions.title = resp.orderCreated;
      this.dialogOptions.text = resp.goToMyOrderToSeeYourOrderDetails;
    });

  }
  back() {
    this.location.back();
  }
  ngOnDestroy() {
    localStorage.removeItem("eventDetails");
    clearInterval(this.interval_on_this_page);
  }
  guestUser() {
    return this.userDataService.isGuestUser();
  }
  loginBtn() {
    this.login = true;
  }
  applyCoupon() {
    this.couponService.findCoupon(this.couponCode).subscribe((resp: any) => {
      if (resp.message) {
        this.myTool.showMyAlert("danger", resp.message);
      } else {
        this.coupon = false;
        this.orderData.userCouponId = resp.userCouponId;
        this.couponData = resp.couponData;
        let totalPrice =
          this.eventData.ticketDetail.ticketPrice *
          this.eventData.ticketDetail.ticketLength;
        let discountedPrice = totalPrice * (resp.couponData.percentOff / 100);
        this.discountTotalPrice = totalPrice - discountedPrice;
        this.orderData.orderAmount = totalPrice;
        this.orderData.discount = discountedPrice;
      }
    }, err => {
      this.myTool.showMyAlert("danger", err.error.error);
    });
  }
  ngOnInit() {
    this.getUserData();
    this.getTicketPercentage()
    let eventData = this.eventData = JSON.parse(localStorage.getItem("eventDetails"));
    this.orderData.quantity = eventData.ticketDetail.ticketLength;
    this.orderData.sellerId = eventData.ticketDetail.sellerId;
    // this.orderData.price = this.eventData.eventDetail.sell_tickets[0].price;
    // this.orderData.sellerId = JSON.parse(
    //   localStorage.getItem("eventDetails")
    // ).eventDetail.sell_tickets[0].sellerId;
  }
  interval_on_this_page;
  ticketTaxPercentage = 0;
  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    });
  }


  getUserData() {
    this.interval_on_this_page = setInterval(() => {
      if (localStorage.getItem("user-ticket")) {
        this.orderData.firstName = JSON.parse(
          localStorage.getItem("user-ticket")
        ).firstName;
        this.orderData.lastName = JSON.parse(
          localStorage.getItem("user-ticket")
        ).lastName;
        this.orderData.email = JSON.parse(
          localStorage.getItem("user-ticket")
        ).email;
        this.orderData.phoneNumber = JSON.parse(
          localStorage.getItem("user-ticket")
        ).phoneNumber;
        this.orderData.userId = JSON.parse(
          localStorage.getItem("userId-ticket")
        );
      }
    }, 500);
  }


  initiateSession() {
    this.myWalletService.initiatePayment().subscribe((resp: any) => {
      if (resp.body.IsSuccess) {
        let sessionData = resp.body.Data;
        localStorage.setItem('applePaymentObject', JSON.stringify(sessionData))
        window.open('https://bombticket.com/applepay', "_self");
      } else {
        alert("Something went wrong, please try later");
      }
    })
  }




  removeCoupon() {
    this.eventData.ticketDetail.ticketPrice = JSON.parse(
      localStorage.getItem("eventDetails")
    ).ticketDetail.ticketPrice;
    this.orderData.userCouponId = 0;
    this.coupon = true;
  }
  totalPrice() {
    let total = this.eventData.ticketDetail.ticketPrice * this.eventData.ticketDetail.ticketLength;
    if (this.coupon == false) {
      return this.discountTotalPrice;
    } else {
      return total;
    }
  }
  dialogOptions = {
    title: "",
    text: "",
    type: "success",
    confirmButtonClass: "btn btn-md btn-success",
  };
  paymentOptions = [];

  // checkOutBtnReturner() {
  //   if (this.selectedPaymentMethodId == 11 || this.selectedPaymentMethodId == 13) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  createOrder() {
    this.orderData.order = [];
    for (
      let index = 0;
      index < this.eventData.ticketDetail.ticket.length;
      index++
    ) {
      const element = this.eventData.ticketDetail.ticket[index];
      this.orderData.order.push(element.id);
    }
    this.orderData.price = this.totalPrice();
    localStorage.setItem("orderData", JSON.stringify(this.orderData));
    // Payment Logic Started Here
    var userMobileNumber = '';
    let mobile = this.orderData.phoneNumber.split(' ').join('');
    if (mobile.length > 11) {
      userMobileNumber = mobile.substr(mobile.length - 11);
    } else {
      userMobileNumber = mobile;
    }
    let data = {
      eventName: this.eventData.eventDetail.title,
      address: this.eventData.eventDetail.location,
      price: this.orderData.price,
      MobileCountryCode: "",
      CustomerMobile: userMobileNumber,
      CustomerEmail: this.orderData.email,
      CustomerName: this.orderData.firstName + " " + this.orderData.lastName,
      Quantity: this.orderData.quantity,
      UserDefinedField: this.eventData.eventDetail.eventImg,
      PaymentMethodId: this.selectedPaymentMethodId
        ? this.selectedPaymentMethodId
        : "",
      SessionId: "",
    };
    // console.log(data);
    localStorage.setItem("paymentData", JSON.stringify(data));

    // if (type == 'sdk') {
    //   this.initiateSession();
    // } else {
    this.myWalletService.getPaymentUrl(data).subscribe((resp: any) => {
      if (resp.Data.PaymentURL) {
        window.open(resp.Data.PaymentURL, "_self");
      } else {
        alert("Something went wrong, please try later");
      }
    });
    // }

  }
  selectedPaymentMethodId;
  openModal(content) {
    // console.log(this.totalPrice())
    let paymentOptionsData = {
      price: this.totalPrice(),
    };
    this.myWalletService
      .getPaymentMethods(paymentOptionsData)
      .subscribe((resp: any) => {
        this.paymentOptions = resp.bodyData.PaymentMethods
        // let myList = resp.bodyData.PaymentMethods;
        // if (myList) {
        //   myList.forEach(item => {
        //     if (item.PaymentMethodId != 11 && item.PaymentMethodId != 25) {
        //       this.paymentOptions.push(item);
        //     }
        //   });
        // }

      });
    this.ngbModal.open(content, { windowClass: "payment-modal-div" });
  }
  getCurrentLang() {
    return localStorage.getItem('ticketLang')
  }
  okBtn() {
    this.router.navigate([""]);
  }
}
