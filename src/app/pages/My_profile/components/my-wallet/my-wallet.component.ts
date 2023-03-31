import { Component, OnInit } from "@angular/core";
import { NgModel } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../../../environments/environment";
import { BankService } from "../../../../../services/bank.service";
import { DataService } from "../../../../../services/data.service";
import { MyWalletService } from "../../../../../services/my-wallet.service";
import { NotificationService } from "../../../../../services/notification.service";
import { UserDataService } from "../../../../../services/user-data.service";

@Component({
  selector: "app-my-wallet",
  templateUrl: "./my-wallet.component.html",
  styleUrls: ["./my-wallet.component.scss",
    "../../../../../vendor/libs/spinkit/spinkit.scss",
  ],
})
export class MyWalletComponent implements OnInit {
  filterVal = "";
  searchKeys = ["status"];
  currentPage = 1;
  totalItems = 0;
  sortBy = "createdAt";
  sortDesc = true;
  perPage = 10;
  productsData = [];
  originalProductsData: Object[] = [];
  loading;
  editId;
  editIndex = null;
  editData = {
    id: null,
    ibanNumber: null,
    bankName: null,
    accountHolderName: null,
    userId: null,
  };
  userBalance = 0
  url = environment.BaseUrl;
  ticket;
  constructor(
    public myWalletServices: MyWalletService,
    public modalService: NgbModal,
    public myTool: NotificationService,
    public BankService: BankService,
    public translateService: TranslateService,
    private userDataService: UserDataService,
    private dataService: DataService,
  ) {
    translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
    translateService.get('myWallet').subscribe((resp: any) => {
      this.dataMyWallet = resp;
    });
  }
  dataSuccess: any;
  dataMyWallet: any;
  dataError: any;

  ngOnInit() {
    this.getTicketPercentage();
    this.editData.userId = JSON.parse(localStorage.getItem("userId-ticket"));
    this.loading = true;
    let id = JSON.parse(localStorage.getItem("userId-ticket"));
    this.myWalletServices.getAllWallet(id).subscribe(
      (resp: any) => {
        this.loading = false;
        this.originalProductsData = resp.slice(0);
        this.update();
      },
      (err) => {
        this.loading = false;
      }
    );
    this.getUserData();
  }

  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    })
  }

  ticketTaxPercentage = 0;

  withdrawAmountReturn(item) {
    let result = 0;
    if (item) {
      if (item.order && item.order.order_tickets) {
        item.order.order_tickets.forEach(element => {
          if (element.ticket && element.ticket.price) {
            result += element.ticket.price;
          }
        });
      }
    }
    return result;
  }


  getUserData() {
    this.userDataService.getOneUser().subscribe((resp: any) => {
      if (resp) {
        this.userBalance = resp.balance;
      }
    })
    this.userDataService.getBankData().subscribe((resp: any) => {
      if (resp) {
        this.editData = resp;
      }
    });
  }

  openModal(targetModal, item, index, type) {
    this.editIndex = index;
    if (item) {
      this.ticket = item.order;
    }
    // if (localStorage.getItem("user-bankInfo")) {
    // let data = JSON.parse(localStorage.getItem("user-bankInfo"));
    // }

    this.modalService.open(targetModal, {
      centered: true,
      size: "lg",
      backdrop: "static",
    });
  }

  addClick() {
    if (
      (this.editData.accountHolderName &&
        this.editData.bankName &&
        this.editData.ibanNumber) == ""
    ) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
    } else {
      this.editData.userId = JSON.parse(localStorage.getItem("userId-ticket"));
      this.BankService.createBank(this.editData).subscribe(
        (resp: any) => {
          this.myTool.showMyAlert(
            "success",
            this.dataSuccess.bankInformationAddedSuccessFully
          );
          this.editData = resp.bank;
          // localStorage.setItem("user-bankInfo", JSON.stringify(resp.bank));
          // this.editData = {
          //   id: "",
          //   accountHolderName: "",
          //   bankName: "",
          //   ibanNumber: "",
          //   userId: this.editData.userId,
          // };
          this.modalService.dismissAll();
        },
        (err) => {
          this.myTool.showMyAlert("danger", err.error.error);
        }
      );
    }
  }
  editClick() {

    this.BankService
      .updateBank(this.editData.id, this.editData)
      .subscribe((resp: any) => {
        this.myTool.showMyAlert(
          "success",
          this.dataSuccess.bankInfoUpdatedSuccessFully
        );
        localStorage.setItem("user-bankInfo", JSON.stringify(resp.bank));
        this.modalService.dismissAll();
      });
  }

  requestItem: any;
  requestIndex: any;

  sendRequestedBtn(item, i) {
    // if (localStorage.getItem("user-bankInfo")) {


    if (this.editData.id) {
      let status = "Requested";
      let withdrawAmount = this.withdrawAmountReturn(item);
      this.myWalletServices
        .WalletUpdate(item.id, { status: status, amount: withdrawAmount })
        .subscribe((resp: any) => {
          this.myTool.showMyAlert(
            "success",
            this.dataSuccess.withDrawSendSuccessFully
          );
          this.userBalance = this.userBalance + withdrawAmount;
          this.productsData[i].status = this.dataMyWallet.requested;
        });
    } else {
      this.myTool.showMyAlert(
        "danger",
        this.dataError.beforeSendWithDrawRequestPleaseAddBankInformation
      );
    }
  }
  getStatusStyle(status) {
    let result = null;
    if (status == "noRequested") {
      result = "text-info align-middle py-2";
    } else if (status == "Requested") {
      result = "text-primary align-middle py-2";
    } else {
      result = "text-success align-middle py-2";
    }
    return result;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  update() {
    const data = this.filter(this.originalProductsData);
    this.totalItems = data.length;
    this.sort(data);
    this.productsData = this.paginate(data);
  }
  filter(data) {
    const filter = this.filterVal.toLowerCase();
    return !filter
      ? data.slice(0)
      : data.filter((d) => {
        return (
          Object.keys(d)
            .filter((k) => this.searchKeys.includes(k))
            .map((k) => String(d[k]))
            .join("|")
            .toLowerCase()
            .indexOf(filter) !== -1 || !filter
        );
      });
  }
  sort(data) {
    data.sort((a: any, b: any) => {
      a =
        typeof a[this.sortBy] === "string"
          ? a[this.sortBy].toUpperCase()
          : a[this.sortBy];
      b =
        typeof b[this.sortBy] === "string"
          ? b[this.sortBy].toUpperCase()
          : b[this.sortBy];

      if (a < b) {
        return this.sortDesc ? 1 : -1;
      }
      if (a > b) {
        return this.sortDesc ? -1 : 1;
      }
      return 0;
    });
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;

    return data.slice(offset, offset + perPage);
  }
  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }

    this.currentPage = 1;
    this.update();
  }
}
