import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { CustomerOrder } from 'src/app/customerOrder/customerOrder';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css'],
})
export class OrderReviewComponent implements OnInit {
  constructor(private http: HttpClient) {}
  customerOrders: Observable<CustomerOrder[]>;
  customerOrderList: CustomerOrder[] = [];
  customerOrderId = localStorage.getItem("orderID");
  totalPrice;

  ngOnInit(): void {
    this.orderReview();
    this.calculateTotalPrice();
  }

  orderReview() {
    this.customerOrders = this.http.get<CustomerOrder[]>(
      'http://localhost:8082/getAllCustomerOrdersLinesString/' +
        this.customerOrderId
    );
    this.customerOrders.subscribe(
      (customerOrderList) => (this.customerOrderList = customerOrderList)
    );

    setTimeout(() => console.log(this.customerOrderList), 100);
  }

  formattingPrice(productPrice) {
    var priceNice = '';
    priceNice = productPrice + '';
    priceNice =
      '€' +
      priceNice.substring(0, priceNice.length - 2) +
      '.' +
      priceNice.substring(priceNice.length - 2, priceNice.length);

    if (priceNice.length == 4) {
      priceNice = priceNice.substring(0, 1) + '0' + priceNice.substring(1, 4);
    }
    return priceNice;
  }

  calculateTotalPrice() {
    console.log(this.customerOrderId);
    this.http
      .get('http://localhost:8082/getTotalPrice/' + this.customerOrderId)
      .subscribe((totalPrice: number) => {
        (this.totalPrice = totalPrice), console.log(totalPrice);
      });
  }

  getTotalPrice() {
    setTimeout(() => {}, 100);
    return this.formattingPrice(this.totalPrice);
  }

  sendMail() {}
}
