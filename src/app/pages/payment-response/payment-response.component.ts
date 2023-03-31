import { UserDataService } from "./../../../services/user-data.service";
import { MyWalletService } from "./../../../services/my-wallet.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { OrderService } from "../../../services/order.service";
import { environment } from "../../../environments/environment";

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-payment-response",
  templateUrl: "./payment-response.component.html",
  styleUrls: ["./payment-response.component.scss"],
})
export class PaymentResponseComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private myWalletService: MyWalletService,
    public orderService: OrderService,
    public userData: UserDataService
  ) { }
  invoiceResponse;
  url = environment.BaseUrl;
  ngOnInit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paymentId = urlParams.get("paymentId");
    const invoiceId = urlParams.get("invoiceId");

    let data = {
      Key: null,
      KeyType: "",
    };
    if (paymentId) {
      data = {
        Key: paymentId,
        KeyType: "paymentId",
      };
    } else if (invoiceId) {
      data = {
        Key: invoiceId,
        KeyType: "invoiceId",
      };
    }
    this.myWalletService.getPaymentStatus(data).subscribe((resp: any) => {
      this.invoiceResponse = resp.paymentResponse.Data;
      if (resp.paymentResponse.Data.InvoiceStatus == "Paid") {
        // if (resp.paymentResponse.Data.InvoiceStatus == "Pending") {
        if (localStorage.getItem("orderData")) {
          let orderData = JSON.parse(localStorage.getItem("orderData"));
          this.orderService.createOrder(orderData).subscribe((resp) => {
            localStorage.removeItem("orderData");
            localStorage.removeItem("paymentData");
            localStorage.removeItem("applePaymentObject");
          });
        }
      }
    });
  }
  isArLng() {
    return this.userData.isLngAr();
  }
  // refinePrice(InvoiceDisplayValue) {
  //   let withoutCurrency = InvoiceDisplayValue.replace("SR", "");
  //   let final = parseFloat(withoutCurrency).toFixed(2) + " SAR";
  //   return final ? final : InvoiceDisplayValue;
  // }

  exportPDF() {
    var data = document.getElementById('print-section');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`invoice-${this.invoiceResponse.InvoiceId}.pdf`);
    });
  }

}
