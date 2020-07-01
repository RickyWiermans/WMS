import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerShopComponent } from './components/customer-shop/customer-shop.component';
import { AllPickingOrdersComponent } from './components/picking-order/all-picking-orders/all-picking-orders.component';
import { CurrentPickingOrderComponent } from './components/picking-order/current-picking-order/current-picking-order.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { OrderReviewComponent } from './components/order-review/order-review.component';

const routes: Routes = [
  { path: 'all-picking-orders', component: AllPickingOrdersComponent },
  // { path: 'current-picking-order', component: CurrentPickingOrderComponent },
  { path: 'customer-shop', component: CustomerShopComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'order-review', component: OrderReviewComponent },
]; // sets up routes constant where you define your routes

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
