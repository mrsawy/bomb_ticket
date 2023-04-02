import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  HostBinding,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../../services/auth.service";

// import { isUserExist } from "../../../services/auth.service";

import { ChangeLanguageService } from "../../../services/change-language.service";
import { NotificationService } from "../../../services/notification.service";
import { UploaderService } from "../../../services/uploader.service";
import { UserDataService } from "../../../services/user-data.service";
import { AppService } from "../../app.service";
import { LayoutService } from "../layout.service";

@Component({
  selector: "app-layout-sidenav",
  templateUrl: "./layout-sidenav.component.html",
  styles: [
    ":host { display: block; }",
    "../../components/auth/auth.component.scss",
    "../../../vendor/libs/spinkit/spinkit.scss",
    "../../../vendor/styles/pages/authentication.scss",
    "../../../vendor/libs/ngx-toastr/ngx-toastr.scss",
    "../../../vendor/libs/ng-select/ng-select.scss",
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutSidenavComponent implements AfterViewInit {
  @Input() orientation = "vertical";

  @HostBinding("class.layout-sidenav") private hostClassVertical = false;
  @HostBinding("class.layout-sidenav-horizontal") private hostClassHorizontal =
    false;
  @HostBinding("class.flex-grow-0") private hostClassFlex = false;
  language = "en";
  loading = false;
  url = environment.BaseUrl;
  @ViewChild("editModal") content: TemplateRef<any>;
  credentials = {
    phoneNumber: "",
    password: "",
  };
  registerData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "male",
    email: "",
    password: "",
  };
  login = true;
  forgotPassword = false;
  forgotData = {
    phoneNumber: "",
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
  dataSuccess: any;
  dataError: any;
  dataAuth: any;
  isLanguageArabic: Boolean;

  otpState: Boolean = false;
  otp_id: String = "";

  //////////
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  ////////
  modal:Boolean=true

  constructor(
    private router: Router,
    private appService: AppService,
    private layoutService: LayoutService,
    public Router: Router,
    private modalService: NgbModal,
    public translate: TranslateService,
    public ChangeLanguageService: ChangeLanguageService,
    public myTool: NotificationService,
    public authServices: AuthService,
    public appServices: AppService,
    public uploaderServices: UploaderService,
    public userData: UserDataService,
    public translateService: TranslateService
  ) {
    this.isLanguageArabic = this.userData.isLngAr();

    translateService.get("dataSuccess").subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get("dataError").subscribe((resp: any) => {
      this.dataError = resp;
    });
    translateService.get("auth").subscribe((resp: any) => {
      this.dataAuth = resp;
    });
    // Set host classes
    this.hostClassVertical = this.orientation !== "horizontal";
    this.hostClassHorizontal = !this.hostClassVertical;
    this.hostClassFlex = this.hostClassHorizontal;
  }

  getLanguage() {
    if (localStorage.getItem("ticketLang")) {
      let lang = localStorage.getItem("ticketLang");
      return lang;
    }
  }

  ngAfterViewInit() {
    // Safari bugfix
    this.layoutService._redrawLayoutSidenav();
  }

  guestUser() {
    return this.userData.isGuestUser();
  }
  getClasses() {
    let bg = this.appService.layoutSidenavBg;

    if (
      this.orientation === "horizontal" &&
      (bg.indexOf(" sidenav-dark") !== -1 ||
        bg.indexOf(" sidenav-light") !== -1)
    ) {
      bg = bg
        .replace(" sidenav-dark", "")
        .replace(" sidenav-light", "")
        .replace("-darker", "")
        .replace("-dark", "");
    }

    return `${
      this.orientation === "horizontal" ? "container " : " bg-light text-dark"
    } bg-${bg}`;
  }
  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  isActive(url) {
    return this.router.isActive(url, true);
  }

  isMenuActive(url) {
    return this.router.isActive(url, false);
  }

  isMenuOpen(url) {
    return (
      this.router.isActive(url, false) && this.orientation !== "horizontal"
    );
  }

  changesLanguage() {
    this.ChangeLanguageService.setLang(this.language);
    window.location.reload();
    this.modalService.dismissAll();
  }
  onItemChange(value) {
    this.language = value;
  }

  exitBtn() {
    localStorage.clear();
    this.Router.navigate([""]);
  }

  isArLng() {
    return this.userData.isLngAr();
  }

  public innerWidth: any;

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  loginBtn() {
    this.loading = true;
    if ((this.credentials.phoneNumber && this.credentials.password) == "") {
      this.myTool.showMyAlert(
        "danger",
        this.dataError.pleaseEnterYourEmailAndPassword
      );
      this.loading = false;
    } else {
      this.authServices.login(this.credentials).subscribe(
        (resp: any) => {
          this.modalService.dismissAll();
          this.myTool.showMyAlert(
            "success",
            this.dataSuccess.userLoginSuccessfully
          );
          localStorage.setItem("user-ticket", JSON.stringify(resp.user));
          localStorage.setItem("userId-ticket", JSON.stringify(resp.user.id));

          this.loading = false;
        },
        (err) => {
          this.loading = false;
          if (err.error.error == "You are blocked by Admin")
            this.myTool.showMyAlert(
              "danger",
              this.dataError.youAreBlockedByAdmin
            );
          else if (err.error.error == "Password is incorrect!")
            this.myTool.showMyAlert(
              "danger",
              this.dataError.passwordIsIncorrect
            );
          else if (err.error.error == "Email does not exist!")
            this.myTool.showMyAlert("danger", this.dataError.emailDoesNotExist);

          this.loading = false;
        }
      );
    }
  }
  registerBtn() {
    this.loading = true;
    if (
      (this.registerData.email &&
        this.registerData.password &&
        this.registerData.firstName &&
        this.registerData.lastName &&
        this.registerData.phoneNumber) == ""
    ) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
      this.loading = false;
    } else if (this.registerData.phoneNumber.length < 7) {
      this.myTool.showMyAlert("danger", this.dataError.pleaseFillTheAllFields);
      this.loading = false;
    } else {
      if (this.registerData.password.length > 6) {
        //////////

        this.email = this.registerData.email;
        this.password = this.registerData.password;
        this.firstName = this.registerData.firstName;
        this.lastName = this.registerData.lastName;
        this.phoneNumber = this.registerData.phoneNumber;
        if (this.registerData.gender) {
          this.gender = this.registerData.gender;
        }

        //////////////

        this.authServices
          .isUserExist({ email: this.registerData.email })
          .subscribe(
            (response) => {
              if (response) {
                this.loading = false;

                this.myTool.showMyAlert(
                  "danger",
                  this.dataError.emailOrPhoneNumberAlreadyExits
                );
              } else {
                this.loading = false;
                //////////////////////////////////////////
                //////////here the code for sending to the OTP state

                this.otpState = true;

                this.authServices
                  .sendOtp({
                    phoneNumber: this.registerData.phoneNumber,
                  })
                  .subscribe(
                    (resp: any) => {
                      console.log(resp);
                      this.otp_id = resp.otp_id;
                    },
                    (err) => {
                      this.myTool.showMyAlert(
                        "danger",
                        `some thing went wrong plaese try again`
                      );
                      console.log(err);
                    }
                  );

                ////////////////////
              }
            },
            (err) => {
              console.log(`error in checking the user:`, err);
            }
          );
      } else {
        this.myTool.showMyAlert(
          "danger",
          this.dataError.passwordShouldBeGreaterThan_6Characters
        );
      }
    }
  }

  verifyOtp(otp) {
    this.authServices.verifyOtp({ otp: otp, otp_id: this.otp_id }).subscribe(
      (resp) => {
        console.log(resp);
        this.otpState = false;
        this.modal = false ;
        this.modalService.dismissAll();

        this.authServices
          .register({
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            gender: this.gender,
            email: this.email,
            password: this.password,
          })
          .subscribe(
            (resp: any) => {
              this.myTool.showMyAlert(
                "success",
                this.dataSuccess.accountSuccessfullyCreated
              );
              localStorage.setItem("user-ticket", JSON.stringify(resp.user));
              localStorage.setItem(
                "userId-ticket",
                JSON.stringify(resp.user.id)
              );
              this.loading = false;
              // this.modal = true
              this.registerData = {
                firstName: "",
                gender: "",
                lastName: "",
                phoneNumber: "",
                email: "",
                password: "",
              };
            },
            (err) => {
              this.loading = false;

              console.log(`couldnt sign in`, err);

              if (err.error.error == "Email already Exits!")
                this.myTool.showMyAlert(
                  "danger",
                  this.dataError.emailOrPhoneNumberAlreadyExits
                );
              else if (
                err.error.error ==
                "Password should be greater than 6 characters!"
              )
                this.myTool.showMyAlert(
                  "danger",
                  this.dataError.passwordShouldBeGreaterThan_6Characters
                );
            }
          );
      },
      (err) => {
        this.myTool.showMyAlert(
          "danger",
          `Enter the correct OTP sent to your SMS`
        );
        console.log(err);
      }
    );
  }

  signUp() {
    this.login = !this.login;
  }
  back() {
    if (this.type == "email") {
      this.login = true;
      this.forgotPassword = false;
    } else if (this.type == "verify") {
      this.type = "email";
    } else if (this.type == "password") {
      this.type = "verify";
    }
  }
  header() {
    let header;
    if (this.type == "email") {
      header = this.dataAuth.forgotPasswordHeader;
    } else if (this.type == "verify") {
      header = this.dataAuth.Verification;
    } else if (this.type == "password") {
      header = this.dataAuth.resetPassword;
    }
    return header;
  }
  forgotBtnText() {
    let header;
    if (this.type == "email") {
      header = this.dataAuth.continue;
    } else if (this.type == "verify") {
      header = this.dataAuth.Verify;
    } else if (this.type == "password") {
      header = this.dataAuth.resetPassword;
    }
    return header;
  }
  forgotPasswordclick() {
    this.forgotPassword = true;
  }
  modaldismis;

  forgotPasswordBtn() {
    if (this.type == "email") {
      this.loading = true;
      this.authServices.forgot_password(this.forgotData).subscribe(
        (resp: any) => {
          this.loading = false;
          this.userId = resp.user.id;
          this.verificationCodeApi = resp.verificationCode;
          this.type = "verify";
        },
        (err) => {
          this.loading = false;
          if (err.error.error == "Email does not exist")
            this.myTool.showMyAlert(
              "danger",
              this.dataError.emailDoesNotExistForForgot
            );
          else if (
            err.error.error == "Error occurred while sending Verification Code"
          )
            this.myTool.showMyAlert(
              "danger",
              this.dataError.errorOccurredWhileSendingVerificationCode
            );
        }
      );
    } else if (this.type == "verify") {
      if (this.forgotData.code == this.verificationCodeApi) {
        this.type = "password";
      } else {
        this.myTool.showMyAlert("danger", this.dataError.invalidCode);
      }
    } else if (this.type == "password") {
      if (this.forgotData.password == this.forgotData.confirmPassword) {
        if (this.forgotData.password.length < 6) {
          this.myTool.showMyAlert(
            "danger",
            this.dataError.passwordMustGreaterThan_6Letter
          );
        } else {
          this.loading = true;
          this.authServices
            .update_user_password(this.userId, this.forgotData)
            .subscribe(
              (resp: any) => {
                this.myTool.showMyAlert(
                  "success",
                  this.dataSuccess.passwordChangeSuccessFully
                );

                this.loading = false;
                this.login = true;
              },
              (err) => {
                this.loading = false;
              }
            );
        }
      } else {
        this.myTool.showMyAlert("danger", this.dataError.passwordNotMatch);
      }
    }
  }
  openModal(targetModal, item, index) {
    this.openModel = true;
    if (localStorage.getItem("ticketLang") == null) {
      localStorage.setItem("ticketLang", "en");
    }
    this.modalService.open(targetModal, {
      centered: true,
      size: "sm",
      backdrop: "static",
    });
  }
}
