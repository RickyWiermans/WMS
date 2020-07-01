import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../product/product';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-customer-shop',
  templateUrl: './customer-shop.component.html',
  styleUrls: ['./customer-shop.component.css'],
})
@Injectable()
export class CustomerShopComponent implements OnInit {
  shopTable: string;
  price: number;
  products: Observable<Product[]>;
  productList: Product[] = [];
  CustomerId = 1;//localStorage.getItem("customerLoginId");
  customerOrderId;
  customerOrderLineId;
  totalPrice;
  productStock;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.showProductsAvailable();
    this.newCustomerOrder()
    this.calculateTotalPrice();
    setTimeout(() => {localStorage.setItem("orderID",this.customerOrderId)},200);
  }

  showProductsToBuy() {
    return this.productList;
  }

  customerOrderLine(product: Product, rowIndex: number){
    if (product.amount == 0 || product.amount == undefined){
      this.newCustomerOrderLine(product, rowIndex);
    }
    else{
      this.updateCustomerOrderLine(product);
      product.amountadded = 0;
      product.amountremoved = 0;
    }
    if (product.amount == 0){
      var btnConfirm = document.getElementById('rowId' + rowIndex);
      (<HTMLInputElement>btnConfirm).disabled = true;
    }
    setTimeout(() => {this.calculateTotalPrice();},200);
    
  }

  checkMaximum(product: Product){
    if (product.amount > product.currentItemsInStorage){
      alert("The maximum amount you can order from this product is " + product.currentItemsInStorage + "!");
      product.amount = product.currentItemsInStorage;
    }
  }
  
  newCustomerOrderLine(product: Product, rowIndex: number){
    var btnConfirm = document.getElementById('rowId' + rowIndex);
    (<HTMLInputElement>btnConfirm).disabled = false;

    if(product.amountadded < 0){
      product.amountadded = 0;
    }

    product.amount = 0;
    product.amount = product.amountadded;
    product.amountadded = 0;
    this.checkMaximum(product);
  
      this.http.get('http://localhost:8082/newCustomerOrderLine/' + 
      this.customerOrderId + "/" + product.id + "/" + product.amount).subscribe(
      (customerOrderLineId: number) => {
        (product.customerOrderLineId = customerOrderLineId),
        console.log("orderLine: " + customerOrderLineId + ' is made');
      }
    )
    
  }

  updateCustomerOrderLine(product: Product){
    if(product.amountadded > 0){
      product.amount += product.amountadded;
      var amounttotaltemp = product.amount + product.amountadded;
      this.checkMaximum(product);
      if(product.amount>product.currentItemsInStorage){
        product.amountadded = (amounttotaltemp - product.currentItemsInStorage);
      }
      console.log("productamount: " + product.amountadded);
      this.http.post("http://localhost:8082/updateCustomerOrderLine/" + 
      product.amountadded + "/" + product.customerOrderLineId,{}).subscribe(
        ()=>console.log("product updated ")
      );
    }
    else if(product.amountremoved > 0){
      if (product.amountremoved - product.amount > 0){
        product.amountremoved = product.amount;
        alert("You can only remove " + product.amountremoved + " product items");
      }
      this.http.post("http://localhost:8082/removeProductItems/" + 
      product.amountremoved + "/" + product.customerOrderLineId,{}).subscribe(
        ()=>console.log("product removed")
      );
      product.amount -= product.amountremoved;
    }
  }

  showProductsAvailable() {
    this.products = this.http.get<Product[]>(
      'http://localhost:8082/allproducts'
    );
    this.products.subscribe(
      (productList) => (this.productList = productList),
      (err) => console.error(err),
      () => console.log('observable complete')
    );
  }

  currenInOrder(product: Product) {
    if(product.amount != 0){
      return product.amount;
    }
    else{
      return "";
    }
  }

  newCustomerOrder() {
    this.http.post('http://localhost:8082/addNewCustomerOrder', this.CustomerId).subscribe(
      (customerOrderId) => {
        (this.customerOrderId = customerOrderId),
          console.log(customerOrderId + ' is making an order');
      },
      (err) => console.error(err),
      () => console.log('observable complete')
    );
  }

  formattingPrice(productPrice) {
    var priceNice = '';
    priceNice = productPrice + '';
    priceNice =
      '€' +
      priceNice.substring(0, priceNice.length - 2) +
      '.' +
      priceNice.substring(
        priceNice.length - 2,
        priceNice.length
      );

    if (priceNice.length == 4){
      priceNice = priceNice.substring(0,1) + "0" + priceNice.substring(1,4);
    }

    return priceNice;
  }

  calculatePrice(product: Product){
    if(product.amount == undefined || product.amount == 0){
      return "";
    }
    var priceproduct = product.amount*product.price;
    return this.formattingPrice(priceproduct);
  }

  calculateTotalPrice(){
    console.log(this.customerOrderId);
    if(this.customerOrderId != undefined){
      this.http.get('http://localhost:8082/getTotalPrice/' + 
      this.customerOrderId).subscribe((totalPrice) => {
      (this.totalPrice = totalPrice), console.log(totalPrice);});
      setTimeout(() => {if(this.totalPrice == 0){
        this.totalPrice = "000";}},50); 
    }
    else{
      this.totalPrice = "000";
    }
  }

  getTotalPrice(){
    return this.formattingPrice(this.totalPrice);
  }

  getMaxOrder(product: Product){
    if(product.amount == undefined){
      product.amount = 0;
    }
     product.inStockLeft = product.currentItemsInStorage - product.amount;
  }

  purchaseOrder(){
    if (this.totalPrice == 0){
      alert("You shopping cart is empty!");
    }
    else{
      this.http.post('http://localhost:8082/purchaseOrder/',this.customerOrderId).subscribe(
        () => console.log("Order is purchased"));
        window.location.assign('http://localhost:4200/order-review/'); 
    }
  }
}
