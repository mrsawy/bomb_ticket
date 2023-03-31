import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../../../services/notification.service";
import { ProfileService } from "../../../../services/profile.service";
import { AppService } from "../../../app.service";
import { LayoutService } from "../../../layout/layout.service";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
})
export class MyProfileComponent implements OnInit {
  curTab = "My profile";
  // curTab = "Order";

  originalProductsData: Object[] = [];

  public innerWidth: any;

  dataSuccess: any;
  dataError: any;
  dataProfile = {
    Home: "",
    MyProfile: "",
    SellerDashboard: "",
    SellerOrder: "",
    MyTicket: "",
    Order: "",
    MyWallet: "",
    ChangePassword: "",
    MyCoupons: "",
  }
  constructor(
    public myTool: NotificationService,
    public profileServices: ProfileService,
    public translate: TranslateService,
    private appService: AppService,
    public modalService: NgbModal,
    public layoutService: LayoutService,
    public ActivatedRoute: ActivatedRoute,
    public router: Router,

  ) {
    translate.get("dataSuccess").subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translate.get("dataError").subscribe((resp: any) => {
      this.dataError = resp;
    });
    translate.get("profile").subscribe((resp: any) => {
      this.dataProfile = resp;
    });
    this.appService.pageTitle = "My Profile";
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.curTab = this.ActivatedRoute.snapshot.params.name;
      }
    });

  }
  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  @HostListener("window:resize", ["$event"])
  openProfile(content, options = {}) {
    // this.modalService.open(content, options).result;
  }
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
  curTabRetruner() {
    let header = '';
    if (this.curTab == 'My profile') {
      header = this.dataProfile.MyProfile;
    } else if (this.curTab == 'Seller Dashboard') {
      header = this.dataProfile.SellerDashboard;
    } else if (this.curTab == 'Seller Order') {
      header = this.dataProfile.SellerOrder;
    } else if (this.curTab == 'My Ticket') {
      header = this.dataProfile.MyTicket;
    } else if (this.curTab == 'Order') {
      header = this.dataProfile.Order;
    } else if (this.curTab == 'Coupons') {
      header = this.dataProfile.MyCoupons;
    } else if (this.curTab == 'My Wallet') {
      header = this.dataProfile.MyWallet;
    } else {
      header = this.dataProfile.ChangePassword;
    }
    return header;
  }
}
