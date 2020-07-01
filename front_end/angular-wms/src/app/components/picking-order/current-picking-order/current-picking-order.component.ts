import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { OrderLine } from './OrderLine';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Button } from 'protractor';

@Component({
  selector: 'app-current-picking-order',
  templateUrl: './current-picking-order.component.html',
  styleUrls: ['./current-picking-order.component.css'],
})
// @Injectable()
export class CurrentPickingOrderComponent implements OnInit {
  /* DEV */

  /* ORDER LINES */
  orderLinesTable: string;
  orderLines: Observable<OrderLine[]>;
  orderLineArray: OrderLine[] = [];

  /* ORDER  */
  orderId: number;
  orderCurrentStatus: string;
  orderStatusDate: string;
  orderStatusTime: string;
  orderTotalItems: number;

  /* CUSTOMER */
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  // customerEmail: string;
  // customerMobilePhone: string;
  // customerPhone: string;
  customerAdress: string;
  customerZipCode: string;

  rowsConfirmed: number = 0;

  activate: boolean;
  constructor(private http: HttpClient, @Inject(DOCUMENT) document) {}

  ngOnInit(): void {
    this.getOrderLines();
  }

  setOrderDetails(orderLineArray) {
    console.log(orderLineArray);
    var order = orderLineArray[0].customerOrder;
    var customer = order.customer;

    this.orderId = order.id;
    this.orderTotalItems = this.calculateTotalItems(orderLineArray);
    this.orderCurrentStatus = order.currentStatus;
    this.orderStatusDate = order.currentStatusLocalDateTime.substring(0, 10);
    this.orderStatusTime = order.currentStatusLocalDateTime.substring(11, 19);

    this.customerId = customer.id;
    this.customerFirstName = customer.firstName;
    this.customerLastName = customer.lastName;
    // this.customerEmail = customer.email;
    // this.customerPhone = customer.phone;
    // this.customerMobilePhone = customer.mobilePhoneNumber;
    this.customerAdress = customer.phoneNumber;
    this.customerAdress = customer.streetAdress;
    this.customerZipCode = customer.zipCode;
  }

  calculateTotalItems(orderLineArray) {
    var result = 0;
    orderLineArray.forEach((element) => {
      result += element.amountOrdered;
    });
    return result;
  }

  pickItems(amountPicked, rowIndex) {
    var currentLine = this.orderLineArray[rowIndex];
    var currentAmountPicked = currentLine.amountPicked + amountPicked;
    if (currentAmountPicked >= 0) {
      currentLine.amountPicked = currentAmountPicked;
    } else {
      currentLine.amountPicked = 0;
    }

    console.log(currentLine.amountOrdered);
    console.log(currentLine.amountPicked);
    var btnConfirm = document.getElementById('rowId' + rowIndex);
    if (currentLine.amountOrdered == currentLine.amountPicked) {
      btnConfirm.className = 'btn btn-sm w-100 btn-primary';
      btnConfirm.innerHTML = 'Confirm';
      (<HTMLInputElement>btnConfirm).disabled = false;
    } else {
      if (currentLine.amountOrdered > currentLine.amountPicked) {
        btnConfirm.innerHTML = 'Incomplete';
      } else if (currentLine.amountOrdered < currentLine.amountPicked) {
        btnConfirm.innerHTML = 'Overcomplete';
      }

      btnConfirm.className = 'btn btn-sm w-100 btn-outline-secondary';
      (<HTMLInputElement>btnConfirm).disabled = true;
    }
  }
  setDisabled() {
    return true;
  }
  confirmRow(rowIndex) {
    var currentLine = this.orderLineArray[rowIndex];
    if (currentLine.amountOrdered != currentLine.amountPicked) {
      console.log('should not be possible to confirm row');
    } else {
      var btnConfirm = document.getElementById('rowId' + rowIndex);
      var btnMinOne = document.getElementById('btn' + rowIndex + '-min-one');
      var btnMinMulti = document.getElementById(
        'btn' + rowIndex + '-min-multi'
      );
      var btnPlusMulti = document.getElementById(
        'btn' + rowIndex + '-plus-multi'
      );
      var btnPlusOne = document.getElementById('btn' + rowIndex + '-plus-one');
      /* DISABLE ALL BUTTONS ON ROW */
      (<HTMLInputElement>btnMinOne).disabled = true;
      (<HTMLInputElement>btnMinMulti).disabled = true;
      (<HTMLInputElement>btnPlusMulti).disabled = true;
      (<HTMLInputElement>btnPlusOne).disabled = true;
      (<HTMLInputElement>btnConfirm).disabled = true;

      /* CHANGE BUTTON CLASSES */
      btnConfirm.className = 'btn btn-sm  w-100 btn-outline-success';
      btnConfirm.innerHTML = '√ Confirmed';

      btnMinOne.className = 'btn btn-sm col-2 mr-2 btn-outline-warning';
      btnMinMulti.className = 'btn btn-sm col-2 mr-2 btn-outline-warning';
      btnPlusMulti.className = 'btn btn-sm col-2 mr-2 btn-outline-secondary';
      btnPlusOne.className = 'btn btn-sm col-2 mr-2 btn-outline-secondary';

      this.rowsConfirmed += 1;
      console.log('√ confirmed row ' + rowIndex);
      this.confirmPickingComplete();
    }
  }

  confirmPickingComplete() {
    console.log(this.rowsConfirmed);
    console.log(this.orderLineArray.length);
    /* Check if all orderLines are confirmed */
    if (this.rowsConfirmed == this.orderLineArray.length) {
      var btnShipOrder = document.getElementById('btn-ship-order');
      (<HTMLInputElement>btnShipOrder).disabled = false;
      btnShipOrder.innerHTML = 'Ship order';
      btnShipOrder.className = 'btn btn-success mb-3 col-12';
      console.log('picking completed for all rows');
    }
  }

  shipOrder() {
    console.log('ship order function');
  }

  getOrderLines() {
    this.orderLines = this.http.get<OrderLine[]>(
      'http://localhost:8082/getNextCustomerOrderToPick'
    );
    this.orderLines.subscribe(
      (orderLineArray) => (this.orderLineArray = orderLineArray),
      (err) => console.error(err),
      () => this.setOrderDetails(this.orderLineArray)
      // () => console.log(this.orderLineArray)
      // () => console.log('observable complete')
    );
  }

  // currenInOrder(product: Product) {
  //   return product.amount;
  // }

  //Hier wordt de order gemaakt, dus dat betekent na inlog dat de customerId hier naar toe gestuurd moet worden.
  // newCustomerOrder() {
  //   this.http.post('http://localhost:8082/addNewCustomerOrder', 1).subscribe(
  //     (CustomerOrderId) => {
  //       (this.CustomerOrderId = CustomerOrderId),
  //         console.log(CustomerOrderId + ' is making an order');
  //     },
  //     (err) => console.error(err),
  //     () => console.log('observable complete')
  //   );

  //   //this.http.post("http://localhost:8082/testing","10").subscribe(response => console.log(response));
  // }

  // formattingPrice(product: Product) {
  //   this.price = product.price;
  //   this.priceNice = '';
  //   this.priceNice = this.price + '';
  //   this.priceNice =
  //     '€' +
  //     this.priceNice.substring(0, this.priceNice.length - 2) +
  //     '.' +
  //     this.priceNice.substring(
  //       this.priceNice.length - 2,
  //       this.priceNice.length
  //     );
  //   return this.priceNice;
  // }
}
