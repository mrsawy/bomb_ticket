import { PaymentResponseComponent } from "./pages/payment-response/payment-response.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Layout1Component } from "./layout/layout-1/layout-1.component";
import { Layout2FlexComponent } from "./layout/layout-2-flex/layout-2-flex.component";
import { Layout2Component } from "./layout/layout-2/layout-2.component";
import { LayoutSidenavComponent } from "./layout/layout-sidenav/layout-sidenav.component";
import { CheckOutComponent } from "./pages/check-out/check-out.component";

// *******************************************************************************
// Pages

import { HomeComponent } from "./pages/home/home.component";
import { MyProfileComponent } from "./pages/My_profile/my-profile/my-profile.component";
import { SellTicketComponent } from "./pages/sell-ticket/sell-ticket.component";
import { TicketDetailComponent } from "./pages/ticket-detail/ticket-detail.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { AboutComponent } from "./pages/about/about.component";
import { TicketDetailNewComponent } from "./pages/ticket-detail-new/ticket-detail-new.component";
import { TermsAndConditionsComponent } from "./pages/terms-and-conditions/terms-and-conditions.component";

// *******************************************************************************
// Routes

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  // { path: "home", component: HomeComponent },
  // { path: "my-profile", component: MyProfileComponent },
  // { path: "sell-ticket", component: SellTicketComponent },
  { path: "ticket-detail/:id", component: TicketDetailNewComponent },
  // { path: "ticket-detail/:id", component: TicketDetailComponent },
  { path: "check-out", component: CheckOutComponent },
  { path: "payment-response", component: PaymentResponseComponent },
  {
    path: "sell-ticket",
    component: Layout2Component,
    children: [{ path: "", component: SellTicketComponent }],
  },
  {
    path: "my-profile/:name",
    component: Layout2Component,
    children: [{ path: "", component: MyProfileComponent }],
  },
  {
    path: "home",
    component: Layout2Component,
    children: [{ path: "", component: HomeComponent }],
  },
  {
    path: "faq",
    component: Layout2Component,
    children: [{ path: "", component: FaqComponent }],
  },
  {
    path: "about",
    component: Layout2Component,
    children: [{ path: "", component: AboutComponent }],
  },
  {
    path: "terms-and-conditions",
    component: Layout2Component,
    children: [{ path: "", component: TermsAndConditionsComponent }],
  },
];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
