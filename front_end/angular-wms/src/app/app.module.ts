import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
/* INFO: https://scotch.io/courses/build-your-first-angular-website/creating-an-angular-header-and-footer */
import { CustomerShopComponent } from './components/customer-shop/customer-shop.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppBootstrapModule } from './app-bootstrap.module';
import { AllPickingOrdersComponent } from './components/picking-order/all-picking-orders/all-picking-orders.component';
import { CurrentPickingOrderComponent } from './components/picking-order/current-picking-order/current-picking-order.component';
import { FooterComponent } from './components/core-structure/footer/footer.component';
import { HeaderComponent } from './components/core-structure/header/header.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { OrderReviewComponent } from './components/order-review/order-review.component';

/* ngx Bootstrap modules */

@NgModule({
  declarations: [
    AppComponent,
    CustomerShopComponent,
    FooterComponent,
    HeaderComponent,
    AllPickingOrdersComponent,
    CurrentPickingOrderComponent,
    UserLoginComponent,
    OrderReviewComponent,
  ], // Eigen werk
  imports: [
    AppBootstrapModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ], // Library modules
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
