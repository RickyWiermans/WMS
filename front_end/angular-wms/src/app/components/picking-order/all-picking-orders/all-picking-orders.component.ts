import {
  Directive,
  Output,
  EventEmitter,
  Input,
  SimpleChange,
} from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PickingLine } from './PickingLine';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Order } from './Order';
import { Customer } from './Customer';

@Component({
  selector: 'app-all-picking-orders',
  templateUrl: './all-picking-orders.component.html',
  styleUrls: ['./all-picking-orders.component.css'],
})
export class AllPickingOrdersComponent implements OnInit {
  pickingLines: Observable<PickingLine[]>;
  pickingLineArray: PickingLine[] = [];

  order: Order;
  customer: Customer;

  rowsConfirmed: number = 0;

  private baseUrl = 'http://localhost:8082';
  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.order = new Order();
    this.customer = new Customer();
    this.getPickingLines();
  }

  setOrderDetails(pickingLineArray) {
    console.log(pickingLineArray);
    /* ORDER */
    var order = pickingLineArray[0].customerOrderLine.customerOrder;
    this.order = order;
    this.order.id = order.id;
    console.log(this.order.id);
    this.order.items = this.calculateTotalItems(pickingLineArray);
    this.order.status = order.currentStatus;
    this.order.statusDate = order.currentStatusLocalDateTime.substring(0, 10);
    this.order.statusTime = order.currentStatusLocalDateTime.substring(11, 19);

    /* CUSTOMER */
    var customer = pickingLineArray[0].customerOrderLine.customerOrder.customer;
    this.customer = customer;
    this.customer.id = customer.id;
    this.customer.firstName = customer.firstName;
    this.customer.lastName = customer.lastName;
    this.customer.address = customer.streetAddress;
    this.customer.zipCode = customer.zipCode;
    this.customer.email = customer.email;

    this.confirmPickingCompleteOnPageLoad(pickingLineArray);
  }

  getPickingLines() {
    this.pickingLines = this.http.get<PickingLine[]>(
      `${this.baseUrl}/getNextCustomerOrderToPick`
    );
    this.pickingLines.subscribe(
      (pickingLineArray) => (this.pickingLineArray = pickingLineArray),
      (err) => console.error(err),
      () => this.setOrderDetails(this.pickingLineArray)
      // () => console.log(this.pickingLineArray)
      // () => console.log('observable complete')
    );
  }

  // disableLines(pickingLineArray) {
  //   var rowIndex = 0;
  //   pickingLineArray.forEach((element) => {
  //     rowIndex++;
  //     var confirmed = element.customerOrderLine.pickingConfirmed;
  //     if (confirmed == true) {
  //       var btnConfirm = document.getElementById('rowId' + rowIndex);
  //       btnConfirm.className = 'btn btn-sm  w-100 btn-outline-success';
  //     }
  //     console.log(confirmed);
  //   });
  // }

  disableRow() {
    console.log('coco');
  }

  calculateTotalItems(pickingLineArray) {
    var result = 0;
    pickingLineArray.forEach((element) => {
      result += element.customerOrderLine.amountOrdered;
    });
    return result;
  }

  pickItems(amountPicked, pickingLine, rowIndex) {
    var currentLine = pickingLine.customerOrderLine;
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
        btnConfirm.className = 'btn btn-sm w-100 btn-danger';
        btnConfirm.innerHTML = 'Overcomplete';
      }

      btnConfirm.className = 'btn btn-sm w-100 btn-outline-secondary';
      (<HTMLInputElement>btnConfirm).disabled = true;
    }
  }

  setDisabled() {
    return true;
  }

  confirmRow(pickingLine, rowIndex) {
    var currentLine = pickingLine.customerOrderLine;
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
      console.log('customerOrderLine id: ' + currentLine.id);
      this.updateOrderLine(currentLine.id);
      this.confirmPickingComplete();
      console.log(currentLine.amountPicked);
      console.log(currentLine.product.id);
    }
  }

  updateOrderLine(id: number) {
    var aVar = this.http.get<any>(`${this.baseUrl}/orderLineIsPicked/${id}`);
    aVar.subscribe(
      () => aVar,
      (err) => console.error(err),
      // () => this.setOrderDetails(this.pickingLineArray)
      // () => console.log(this.pickingLineArray)
      () => console.log('observable complete')
    );
  }

  confirmPickingComplete() {
    //console.log(this.rowsConfirmed);
    //console.log(this.pickingLineArray.length);
    /* Check if all orderLines are confirmed */
    if (this.rowsConfirmed == this.pickingLineArray.length) {
      var btnShipOrder = document.getElementById('btn-ship-order');
      (<HTMLInputElement>btnShipOrder).disabled = false;
      btnShipOrder.innerHTML = 'Ship order';
      btnShipOrder.className = 'btn btn-success mb-3 col-12';
      console.log('picking completed for all rows');
    }
  }

  confirmPickingCompleteOnPageLoad(pickingLineArray) {
    pickingLineArray.forEach((element) => {
      if (element.customerOrderLine.pickingConfirmed == true) {
        this.rowsConfirmed++;
      }
    });
    this.confirmPickingComplete();
  }

  shipOrder() {
    console.log('ship order function');
    console.log('orderId = ' + this.order.id);
    this.callShipping(this.order.id);
  }

  callShipping(id) {
    var aVar = this.http.get<any>(`${this.baseUrl}/shipOrder/${id}`);
    aVar.subscribe(
      () => aVar,
      (err) => console.error(err),
      // () => this.setOrderDetails(this.pickingLineArray)
      // () => console.log(this.pickingLineArray)
      () => console.log('observable complete, order is send')
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
