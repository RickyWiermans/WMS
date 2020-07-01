package nl.group.wms.api;

import nl.group.wms.Utils;
import nl.group.wms.controller.CustomerOrderPickingServcie;
import nl.group.wms.controller.CustomerOrderRepository;
import nl.group.wms.controller.CustomerOrderService;
import nl.group.wms.domein.CustomerOrder;
import nl.group.wms.domein.CustomerOrderLine;
import nl.group.wms.domein.CustomerOrderPickingLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
public class CustomerOrderPickingEndpoint {

    @Autowired
    CustomerOrderRepository cor;

    @Autowired
    CustomerOrderPickingServcie cops;

    @Autowired
    CustomerOrderService cos;

    @GetMapping("/customerOrderPickingLineExistsBy/{customerOrderLineId}")
    public boolean checkIfPickingLineExistsBy(@PathVariable long customerOrderLineId) {
        return cops.customerOrderPickingLineExistsBy(customerOrderLineId);
    }

    //This is for one customer
    @GetMapping("/getNextCustomerOrderToPick")
    public Iterable<CustomerOrderPickingLine> getNextCustomerOrderToPick() {
        Iterable<CustomerOrderPickingLine> orderLines = cops.getNextCustomerOrderToPick();
        return orderLines;
    }

    @GetMapping("/shipOrder/{customerOrderId")
    public void shipCustomerOrder(long customerOrderId) {
        System.out.println(Utils.ic(Utils.ANSI_BLUE, "Shipping order with id: " + customerOrderId));
        cops.shipCustomerOrder(customerOrderId);
    }


    @GetMapping("/addCustomerOrderStatusSend/{orderId}")
    public void setPickedOrderStatus(@PathVariable Long orderId) {
        CustomerOrder order = cor.findById(orderId).get();
        order.addStatusToMap(CustomerOrder.status.SHIPPED_TO_CUSTOMER);
        cos.updateCustomerOrder(order);
    }

    @GetMapping("/addCustomerOrderStatusIncomming/{orderId}")
    public void setPickedOrderStatusIncomming(@PathVariable Long orderId) {
        CustomerOrder order = cor.findById(orderId).get();
        order.addStatusToMap(CustomerOrder.status.PRE_PURCHASE);
        cos.updateCustomerOrder(order);
    }

    @GetMapping("/addCustomerOrderStatusReady/{orderId}")
    public void setPickedOrderStatusReady(@PathVariable Long orderId) {
        CustomerOrder order = cor.findById(orderId).get();
        order.addStatusToMap(CustomerOrder.status.READY_FOR_PICKING);
        cos.updateCustomerOrder(order);
    }

    @GetMapping("/getCurrentStatus/{orderId}")
    public void getCurrentStatus(@PathVariable Long orderId) {
        CustomerOrder order = cor.findById(orderId).get();
        order.getCurrentStatus();
    }

    @GetMapping("/orderLineIsPicked/{customerOrderLineId}")
    public void orderLineIsPicked(@PathVariable long customerOrderLineId) {
        cops.orderLineIsPicked(customerOrderLineId);
    }

    @PostMapping("/postTest")
    public void putTest(@RequestBody CustomerOrderLine line) {
        System.out.println(line.toString());
    }

    @GetMapping("/getTest/{id}")
    public void getTest(@PathVariable long id) {
        System.out.println(id);
    }

}
