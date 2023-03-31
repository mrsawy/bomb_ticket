import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// *******************************************************************************
// Layouts

import { Layout1Component } from './layout-1/layout-1.component';
import { Layout1FlexComponent } from './layout-1-flex/layout-1-flex.component';
import { Layout2Component } from './layout-2/layout-2.component';
import { Layout2FlexComponent } from './layout-2-flex/layout-2-flex.component';
import { LayoutWithoutNavbarComponent } from './layout-without-navbar/layout-without-navbar.component';
import { LayoutWithoutNavbarFlexComponent } from './layout-without-navbar-flex/layout-without-navbar-flex.component';
import { LayoutWithoutSidenavComponent } from './layout-without-sidenav/layout-without-sidenav.component';
import { LayoutHorizontalSidenavComponent } from './layout-horizontal-sidenav/layout-horizontal-sidenav.component';
import { LayoutBlankComponent } from './layout-blank/layout-blank.component';


// *******************************************************************************
// Components

import { LayoutNavbarComponent } from './layout-navbar/layout-navbar.component';
import { LayoutSidenavComponent } from './layout-sidenav/layout-sidenav.component';
import { LayoutFooterComponent } from './layout-footer/layout-footer.component';


// *******************************************************************************
// Libs

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavModule } from '../../vendor/libs/sidenav/sidenav.module';


// *******************************************************************************
// Services

import { LayoutService } from './layout.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LaddaModule } from 'angular2-ladda';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { LanguageLoader } from '../app.module';


// *******************************************************************************
//

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SidenavModule,
    TagInputModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 2100,
      preventDuplicates: true,
    }),

    // // App
    LaddaModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    Layout1Component,
    Layout1FlexComponent,
    Layout2Component,
    Layout2FlexComponent,
    LayoutWithoutNavbarComponent,
    LayoutWithoutNavbarFlexComponent,
    LayoutWithoutSidenavComponent,
    LayoutHorizontalSidenavComponent,
    LayoutBlankComponent,
    LayoutNavbarComponent,
    LayoutSidenavComponent,
    LayoutFooterComponent
  ],
  providers: [
    LayoutService
  ]
})
export class LayoutModule { }
