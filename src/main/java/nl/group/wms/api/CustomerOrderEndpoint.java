package nl.group.wms.api;

import nl.group.wms.controller.CustomerOrderService;
import nl.group.wms.domein.CustomerOrder;
import nl.group.wms.domein.CustomerOrderLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerOrderEndpoint {

    @Autowired
    CustomerOrderService cos;

    @PostMapping("/addNewCustomerOrder")
    public long addNewOrder(@RequestBody long customerId) {
        return cos.addNewCustomerOrder(customerId);
    }

    //This is for one customer
    @GetMapping("/getAllCustomerOrders/{customerId}")
    public List<CustomerOrder> getAllCustomerOrdersByCustomerId(@PathVariable long customerId) {
        List<CustomerOrder> customerOrders = cos.getAllCustomerOrdersByCustomerId(customerId);
        return customerOrders;
    }


    @GetMapping("/getOrderLine/{customerOrderLineId")
    public CustomerOrderLine getOrderLine(long customerOrderLineId) {
        return cos.getOrderLine(customerOrderLineId);
    }

//    @PostMapping("/newCustomerOrderLine")
//    public long newOrderLine(@RequestBody CustomerOrderLine customerOrderLine) {
//        return cos.newCustomerOrderLine(customerOrderLine);
//    }

//    @PostMapping("/newCustomerOrderLine")
//    public long newOrderLine(@RequestBody long customerOrderId, @RequestBody long productId,
//                             @RequestBody int amount) {
//        return cos.newCustomerOrderLine(customerOrderId, productId, amount);
//    }

    @GetMapping("/newCustomerOrderLine/{customerOrderId}/{productId}/{amount}")
    public long newOrderLine(@PathVariable long customerOrderId, @PathVariable long productId,
                             @PathVariable int amount) {
        System.out.println("Ik kom hier");
        return cos.newCustomerOrderLine(customerOrderId, productId, amount);
    }

    @PostMapping("/updateCustomerOrderLine/{amountIncrease}/{customerOrderLineId}")
    public void updateOrderLine(@PathVariable int amountIncrease, @PathVariable long customerOrderLineId) {
        cos.updateCustomerOrderLine(amountIncrease, customerOrderLineId);
    }


    @PostMapping("/removeProductItems/{amountRemoved}/{customerOrderLineId}")
    public void removeProductItems(@PathVariable int amountRemoved, @PathVariable long customerOrderLineId) {

        cos.removeProductItems(amountRemoved, customerOrderLineId);
    }

    //This if for one customer
    @GetMapping("/getTotalPrice/{customerOrderId}")
    public int getTotalPrice(@PathVariable long customerOrderId) {
        return cos.getTotalPrice(customerOrderId);
    }

    @PostMapping("/purchaseOrder")
    public void purchaseOrder(@RequestBody long customerOrderId) {
        cos.purchaseOrder(customerOrderId);
    }

//    //This is for one customer
//    @GetMapping("/getAllCustomerOrdersLinesString/{customerOrderId}")
//    public String getAllCustomerOrdersLinesString(@PathVariable long customerOrderId) {
//        String customerOrdersString = cos.getAllCustomerOrdersLinesString(customerOrderId);
//        System.out.println(customerOrdersString);
//        return customerOrdersString;
//    }

    //This is for one customer
    @GetMapping("/getAllCustomerOrdersLinesString/{customerOrderId}")
    public List<CustomerOrderLine> getAllCustomerOrderLines(@PathVariable long customerOrderId) {
        List<CustomerOrderLine> customerOrderLines = cos.getAllCustomerOrderLines(customerOrderId);
        System.out.println(customerOrderLines);
        return customerOrderLines;
    }
}


//    @PostMapping("/updateCustomerOrderLine")
//    public void updateOrderLine(@RequestBody int amountIncrease, @RequestBody long customerOrderLineId){
//        cos.updateCustomerOrderLine(amountIncrease, customerOrderLineId);
//    }

//    @PostMapping("/removeProductItems")
//    public void removeProductItems(@RequestBody int amountRemoved, @RequestBody long customerOrderLineId){
//        cos.removeProductItems(amountRemoved, customerOrderLineId);
//    }