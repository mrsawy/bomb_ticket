import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { async } from "rxjs/internal/scheduler/async";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../../services/auth.service";
import { DataService } from "../../../services/data.service";
import { EventService } from "../../../services/event.service";
import { NotificationService } from "../../../services/notification.service";
import { ProfileService } from "../../../services/profile.service";
import { TicketSectionService } from "../../../services/ticket-section.service";
import { TicketService } from "../../../services/ticket.service";
import { UploaderService } from "../../../services/uploader.service";
import { UserDataService } from "../../../services/user-data.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-sell-ticket",
  templateUrl: "./sell-ticket.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: [
    "./sell-ticket.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
    "../../../vendor/styles/pages/authentication.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../vendor/libs/ng-select/ng-select.scss",
    "../../../vendor/libs/angular2-ladda/angular2-ladda.scss",
  ],
})
export class SellTicketComponent implements OnInit {
  loading = false;
  loadingBtn = false;
  url = environment.BaseUrl;
  @ViewChild("editModal") content: TemplateRef<any>;
  credentials = {
    email: "",
    password: "",
  };
  registerData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  };
  login = true;
  forgotPassword = false;
  forgotData = {
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  };
  userId;
  verificationCodeApi;
  type = "email";
  openModel;
  allEvent = [];
  eventId;
  cardDetails = true;
  ticketCardDetails = false;
  eventData = {
    createdAt: "",
    dateTime: "",
    eventImg: "",
    id: 0,
    lat: "",
    lng: "",
    location: "",
    subtitle: "",
    termsAndCondition: "",
    title: "",
    updatedAt: "",
  };
  isBesideEachOther = true;
  ticketSectionId;
  ticketQuantity = [];
  quantity = [];
  quantityLength;
  ticketSectionEvent = [];
  price;
  toBeUploadedFilesArray = [];
  UploadFilesArray = [];
  completedTicket = false;
  index;
  loginDiv = false;
  constructor(
    public modalService: NgbModal,
    public myTool: NotificationService,
    public authServices: AuthService,
    public appServices: AppService,
    public eventService: EventService,
    public ticketSection: TicketSectionService,
    public ticketServices: TicketService,
    public uploaderServices: UploaderService,
    public translateService: TranslateService,
    public userDataService: UserDataService,
    private dataService: DataService,
    private profileService: ProfileService
  ) {
    translateService.get("dataSuccess").subscribe((resp: any) => {
      
      this.dataSuccess = resp;
    });
    translateService.get("dataError").subscribe((resp: any) => {
      this.dataError = resp;
    });
    this.appServices.pageTitle = "Sell Ticket";
  }
  isArLng() {
    return this.userDataService.isLngAr();
  }
  dataSuccess: any;
  dataError: any;
  ticketTaxPercentage = 0;
  @ViewChild("disclaimerDialog") disclaimerDialog;
  ngOnInit() {
    this.getTicketPercentage();
    this.eventService.getAllEvents().subscribe((resp: any) => {
      this.allEvent = resp.allEvent;
    });
    this.checkDisclaimerDialog();

  }

  showDisclaimer() {
    this.disclaimerDialog.show();
  }

  checkDisclaimerDialog() {
    // let user = this.userDataService.userReturner();
    // if (!user.isDisclaimerAgreed) {
    //   setTimeout(() => {
    //     this.disclaimerDialog.show();
    //   }, 2000);
    // }
  }

  markDisclaimer() {
    // let user = this.userDataService.userReturner();
    // this.profileService.markDisclaimer(user.id).subscribe((resp: any) => {
    //   user.isDisclaimerAgreed = true;
    //   localStorage.setItem('user-ticket', JSON.stringify(user));
    // });
  }

  guestUser() {
    return this.userDataService.isGuestUser();
  }
  loginBtn() {
    this.loginDiv = true;
  }

  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    });
  }

  selectEvent(event) {
    this.loading = true;
    this.eventData = event;
    this.ticketSection
      .getTicketSectionByEvents(event.id)
      .subscribe((resp: any) => {
        this.loading = false;
        this.cardDetails = false;
        this.ticketCardDetails = true;
        this.completedTicket = false;
        this.ticketSectionEvent = resp;
      });
    // for (let index = 1; index < 26; index++) {
    //   this.ticketQuantity[index];
    //   let data = { id: index, name: "" };
    //   this.ticketQuantity.push(data);
    // }
  }

  // selectTicketQuantity(event) {
  //   this.quantityLength = event.id;
  //   this.quantity = [];
  //   this.toBeUploadedFilesArray = [];
  //   for (let index = 0; index < event.id; index++) {
  //     let data = { id: index, name: "" };
  //     this.quantity.push(data);
  //   }
  // }

  // async fileChanged(file, item) {
  //   let myFile = file.target.files[0];
  //   if (myFile.type == "application/pdf") {
  //     let index = await this.isPushedReturn(item.id);
  //     if (index) {
  //       this.toBeUploadedFilesArray.splice(index, 1);
  //       this.toBeUploadedFilesArray.push({
  //         id: item.id,
  //         file: file.target.files[0],
  //       });
  //     } else {
  //       this.toBeUploadedFilesArray.push({
  //         id: item.id,
  //         file: file.target.files[0],
  //       });
  //     }
  //   }
  // }

  ticketsQuantityLength = 0;
  uploadTicketsFilesArray = [];
  // prevUploadedFilesArray = [];
  // newUploadedFilesArray = [];

  async fileChangedUpload(event) {
    let files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.ticketsQuantityLength += 1;
        if (element.type == "application/pdf") {
          this.uploaderServices
            .uploadImage(element)
            .subscribe((fileName: any) => {
              let data = {
                oldName: element.name,
                newName: fileName,
              };
              this.uploadTicketsFilesArray.push(data);
            });
        }
      }
    }
  }

  // isPushedReturn(id) {
  //   let result = null;
  //   this.toBeUploadedFilesArray.forEach((item, ind) => {
  //     if (item.id == id) {
  //       result = ind;
  //     }
  //   });
  //   return result;
  // }

  // fileTypeReturn(id) {
  //   let result = null;
  //   let myFiles = this.toBeUploadedFilesArray;
  //   if (myFiles) {
  //     myFiles.forEach((item) => {
  //       if (item.id == id) {
  //         if (item.file.type == "application/pdf") {
  //           result = true;
  //         } else {
  //           result = false;
  //         }
  //       }
  //     });
  //   }
  //   return result;
  // }

  // (this.ticketsQuantityLength == this.newUploadedFilesArray.length)

  // allFilesValid() {
  //   let total = 0;
  //   let myFiles = this.toBeUploadedFilesArray;
  //   if (myFiles) {
  //     myFiles.forEach((item) => {
  //       if (item) {
  //         if (item.file.type == "application/pdf") {
  //           total += 1;
  //         }
  //       }
  //     });
  //   }
  //   if (this.quantity) {
  //     if (this.quantity.length == total) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }

  priceReturn(price) {
    let data = {
      tax: 0,
      price: 0,
      finalPrice: 0,
    };
    if (price) {
      let tax = price * (this.ticketTaxPercentage / 100);
      let finalPrice = price + tax;
      data = {
        tax: JSON.parse(tax.toFixed(2)),
        price: price.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
      };
    }
    return data;
  }

  continueBtnReturn() {
    if (
      this.ticketSectionId &&
      this.price &&
      this.ticketsQuantityLength == this.uploadTicketsFilesArray.length
    ) {
      return false;
    } else {
      return true;
    }
  }

  async continue() {
    this.loadingBtn = true;


    console.log(`continue()`);
    

    if (
      (this.price && this.ticketSectionId && this.quantityLength) == undefined
    ) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
      this.loadingBtn = false;
    } else {
      // if (this.quantityLength == this.toBeUploadedFilesArray.length) {
      //   this.UploadFilesArray = [];
      //   await this.toBeUploadedFilesArray.forEach(async (element, index) => {
      //     await this.uploaderServices
      //       .uploadImage(element.file)
      //       .subscribe(async (resp: any) => {
      //         await this.UploadFilesArray.push(resp);
      //         console.log(
      //           this.toBeUploadedFilesArray.length,
      //           "length",
      //           index + 1,
      //           "index "
      //         );
      //         if (this.toBeUploadedFilesArray.length === index + 1) {
      //           console.log("done", index, this.UploadFilesArray.length);
      //           // this.afterAllUploads();
      //         }
      //       });
      //   });
      // } else {
      //   this.loadingBtn = false;
      //   this.myTool.showMyAlert(
      //     "danger",
      //     this.dataError.pleaseAddAllTicketsImages
      //   );
      // }
    }
  }

  afterAllUploads() {
    this.loadingBtn = true;
    let ticketsArray = this.uploadTicketsFilesArray.map((x) => x.newName);
    let data = {
      price: this.price,
      sellerId: JSON.parse(localStorage.getItem("userId-ticket")),
      eventId: this.eventData.id,
      UploadFilesArray: ticketsArray,
      ticketSectionId: this.ticketSectionId,
      isBesideEachOther: this.isBesideEachOther,
    };
    this.ticketServices.createTicket(data).toPromise().then(()=>{ 
      this.loadingBtn = false;
      this.completedTicket = true;
      this.loading = false;
      this.cardDetails = false;
      this.ticketCardDetails = false;
      setTimeout(() => {
        this.completedTicket = false;
        this.loading = false;
        this.cardDetails = true;
        this.ticketCardDetails = false;
      }, 5000);
    },(err)=>{console.log(`err:`,err);
    })
    // ((resp: any) => {
    // })
    
    ;
  }
  onBesidesChange(e) {
    this.isBesideEachOther = e.target.value == "true" ? true : false;
  }
  sortablejsOptions: Object = {
    animation: 150,
    handle: ".project-task-handle",
    group: {
      name: "project-task-list",
      put: true,
      pull: true,
    },
  };
}
