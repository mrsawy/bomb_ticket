import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SwiperModule } from "ngx-swiper-wrapper";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppService } from "./app.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TagInputModule } from "ngx-chips";
import { LaddaModule } from "angular2-ladda";
import { HomeComponent } from "./pages/home/home.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { EventComponent } from "./components/event/event.component";
import { BookTicketComponent } from "./components/book-ticket/book-ticket.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SellTicketComponent } from "./pages/sell-ticket/sell-ticket.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { TicketDetailComponent } from "./pages/ticket-detail/ticket-detail.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import { MyProfileComponent } from "./pages/My_profile/my-profile/my-profile.component";
import { ProfileComponent } from "./pages/My_profile/components/profile/profile.component";
import { SellerDashboardComponent } from "./pages/My_profile/components/seller-dashboard/seller-dashboard.component";
import { MyTicketComponent } from "./pages/My_profile/components/my-ticket/my-ticket.component";
import { MyOrderComponent } from "./pages/My_profile/components/my-order/my-order.component";
import { MyWalletComponent } from "./pages/My_profile/components/my-wallet/my-wallet.component";
import { ChangePasswordComponent } from "./pages/My_profile/components/change-password/change-password.component";
// *******************************************************************************
//
// import { AgmCoreModule } from "@agm/core";
import { CheckOutComponent } from "./pages/check-out/check-out.component";
import { SellerOrderComponent } from "./pages/My_profile/components/seller-order/seller-order.component";
import { AuthComponent } from "./components/auth/auth.component";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { PartnerShipComponent } from "./components/partner-ship/partner-ship.component";
import { LayoutModule } from "./layout/layout.module";
import { PaymentResponseComponent } from "./pages/payment-response/payment-response.component";
import { NgxPrintModule } from "ngx-print";
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { NumberPickerModule } from 'ng-number-picker';
import { TicketDetailNewComponent } from './pages/ticket-detail-new/ticket-detail-new.component';
import { SortablejsModule } from 'angular-sortablejs';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { MyDateTimePipe } from './pipes/my-date-time.pipe';
import { DatePipe } from "@angular/common";
import { MyCouponsComponent } from './pages/my_profile/components/my-coupons/my-coupons.component';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    CarouselComponent,
    EventComponent,
    BookTicketComponent,
    FooterComponent,
    SellTicketComponent,
    TicketDetailComponent,
    MyProfileComponent,
    ProfileComponent,
    SellerDashboardComponent,
    MyTicketComponent,
    MyOrderComponent,
    MyWalletComponent,
    ChangePasswordComponent,
    CheckOutComponent,
    SellerOrderComponent,
    AuthComponent,
    PartnerShipComponent,
    PaymentResponseComponent,
    AboutComponent,
    FaqComponent,
    TicketDetailNewComponent,
    TermsAndConditionsComponent,
    MyDateTimePipe,
    MyCouponsComponent,
  ],

  imports: [
    BrowserModule,
    LayoutModule,
    FormsModule,
    NgSelectModule,
    TagInputModule,
    Ng2SearchPipeModule,
    NgxPrintModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2100,
      preventDuplicates: true,
    }),
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCBuZJQoWf164jtX6ML5-ArJy8ZPTvbars',
    //   libraries: ['places']
    // }),
    SwiperModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: "btn btn-lg btn-primary",
      cancelButtonClass: "btn btn-lg btn-default",
    }),
    HttpClientModule,
    ChartsModule,
    // App
    LaddaModule,
    BrowserAnimationsModule,
    SweetAlert2Module,
    AppRoutingModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
    NumberPickerModule,
    SortablejsModule,
  ],

  providers: [Title, AppService, DatePipe],

  bootstrap: [AppComponent],
})
export class AppModule { }
