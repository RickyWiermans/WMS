package nl.group.wms.controller;

import nl.group.wms.Utils;
import nl.group.wms.domein.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class CustomerOrderPickingServcie {
    @Autowired
    CustomerOrderPickingLineRepository coplr;

    @Autowired
    CustomerOrderRepository cor;

    @Autowired
    CustomerOrderLineRepository olr;

    @Autowired
    ProductItemRepository pir;

    @Autowired
    CustomerOrderService cos;

    @Autowired
    BoxService bs;


    /**
     * Checks te database for the oldest order with status READY_FOR_PICKING
     * {@link #getCustomerOrderPickingLines(Iterable)}
     *
     * @return a collection of CustomerOrderPickingLines. Including for each line a customerOrderLine and a HashMap with boxinfo: boxId and quantity stored
     */
    public Iterable<CustomerOrderPickingLine> getNextCustomerOrderToPick() {

        Iterable<CustomerOrder> customerOrders = cos.getAllCustomerOrders();

        /* Check if there are orders */
        if (customerOrders.iterator().hasNext()) {

            /* Fill ArrayList with pickable orders */
            ArrayList<CustomerOrder> ordersReadyForPicking = new ArrayList<>();
            for (CustomerOrder order : customerOrders) {
                if (order.getCurrentStatus().equals(CustomerOrder.status.READY_FOR_PICKING)) {
                    ordersReadyForPicking.add(order);
                }
            }

            /* Check for the oldes pickable order */
            if (ordersReadyForPicking.size() > 0) {
                CustomerOrder nextOrderToPick = ordersReadyForPicking.get(0);
                for (CustomerOrder order : ordersReadyForPicking) {
                    if (order.getCurrentStatusLocalDateTime().isAfter(nextOrderToPick.getCurrentStatusLocalDateTime())) {
                        /* Replace new order with older order */
                        nextOrderToPick = order;
                    }
                }
                printOrderInfo(nextOrderToPick); // Print stuff for development purpose


                /* Return orderLines for oldest pickable order */
                long orderId = nextOrderToPick.getId();
                return getCustomerOrderPickingLines(getCustomerOrderLinesById(orderId));
            }
        }

        /* When here, there are no pickable orders in the database ... :( */
        System.out.println(Utils.ic(Utils.ANSI_RED, "NO ORDERS WITH STATUS READY_FOR_PICKING"));
        return null;

    }

    /**
     * Generates and/or updates customerOrderPickingLines for {@link #getNextCustomerOrderToPick()}
     *
     * @param customerOrderLines is used to check for each line if a corresponding CustomerOrderPickingLine should be created or updated
     * @return a collection with CustomerOrderPickingLines.
     */
    public Iterable<CustomerOrderPickingLine> getCustomerOrderPickingLines(Iterable<CustomerOrderLine> customerOrderLines) {
        List<CustomerOrderPickingLine> pickingLines = new ArrayList<>();
        for (CustomerOrderLine customerOrderLine : customerOrderLines) {

            long customerOrderLineId = customerOrderLine.getId();

            long productId = customerOrderLine.getProduct().getId();
            HashMap<Long, Long> boxMap = bs.getAllBoxidsAndQuantityStored(productId);

            CustomerOrderPickingLine pickingLine = null;

            /* Update existing pickingLine entry */
            if (customerOrderPickingLineExistsBy(customerOrderLineId)) {
                List<CustomerOrderPickingLine> existingPickingLines = coplr.findCustomerOrderPickingLineBy(customerOrderLineId);
                if (existingPickingLines.iterator().hasNext()) {
                    pickingLine = existingPickingLines.iterator().next();
                    pickingLine.setBoxQuantityMap(boxMap);
                    System.out.println("update line: " + pickingLine.getId());
                }

                /* Create new pickingLine entry  */
            } else {
                // create
                pickingLine = new CustomerOrderPickingLine(customerOrderLine, boxMap);
                System.out.println("created line: new line");
            }

            /* Save pickingLine */
            coplr.save(pickingLine);

            /* Add pickingLine to list */
            pickingLines.add(pickingLine);
        }

        Iterable<CustomerOrderPickingLine> result = pickingLines;
        printPickingLineInfo(result); // Print stuff for development purpose
        return result;
    }

    /* NEW */
    public boolean customerOrderPickingLineExistsBy(long customerOrderLineId) {
        long entrys = coplr.customerOrderPickingLineExistsBy(customerOrderLineId);
        if (entrys > 1) {
            System.out.println(Utils.ic(Utils.ANSI_RED, "WARNING: More then one [" + entrys + "] customerOrderPickingLines with customerOrderLineId: " + customerOrderLineId +
                    "\n\tRelationship should be OneToOne"));
        }

        return entrys > 0;
    }


    public Iterable<CustomerOrderLine> getCustomerOrderLinesById(long customerOrderId) {
        Iterable<CustomerOrderLine> orderLines = olr.findByCustomerOrderId(customerOrderId);
        return orderLines;
    }


    /* CONFIRM PICKING */

    /**
     * When all productItems in a customerOrderLine are picked, a picking employee presses confirms this.
     * After confirming the line, this method is called.
     * All productItems on this line get status READY_FOR_TRANSIT.
     * Items are picked from one box till it's empty, before picking from the next box.
     */
    public void orderLineIsPicked(long customerOrderLineId) {
        /* get customerOrderLine */
        CustomerOrderLine customerOrderLine = cos.getOrderLine(customerOrderLineId);
        /* get product */
        /* get amount ordered */
        long productId = customerOrderLine.getProduct().getId();
        long amountOrdered = customerOrderLine.getAmountOrdered();
        /* print to console */
        System.out.println("Product naam " + customerOrderLine.getProduct().getName());
        System.out.println("Product id : " + productId);
        System.out.println("Amount ordered : " + amountOrdered);
        /* get list of boxes wher product is stored */
        Iterable<Box> boxes = bs.getAllBoxesWithProduct(productId);
        //
        int index = 0;
        for (Box box : boxes) {
            /* get list with items in box */
            List<ProductItem> productItems = pir.findProductItemByBox(box);
            System.out.println("box id: " + box.getId());
            System.out.println("size iterator (items in box): " + productItems.size());

            if (productItems.size() > 0) { // box heeft items
                System.out.println("///" + amountOrdered);
                System.out.println("///" + productItems.size());
                if (amountOrdered >= productItems.size()) { // orderLine bevat >= of meer  items dan in de box zitten. Neem alle items uit de box
                    for (int i = 0; i < productItems.size(); i++) {
                        System.out.println("IN LOOP ONE");
                        index++;
                        processOrderLine(productItems, index);
                        amountOrdered--;
                    }
                } else { // orderLine bevat < items dan in de box zitten
                    long loop = amountOrdered;
                    for (int i = 0; i < loop; i++) {
                        System.out.println("IN LOOP TWO");
                        index++;
                        processOrderLine(productItems, index);
                        amountOrdered--;
                    }

                }
            } else {
                // doe niks, box heeft geen items
            }
        }
        //TODO CHECK OF LAATSTE DRIE LINES WERKEN
        customerOrderLine.setAmountPicked(customerOrderLine.getAmountOrdered());
        customerOrderLine.setPickingConfirmed(true);
        olr.save(customerOrderLine);
    }

    /**
     * Used for looops in {@link #orderLineIsPicked(long)}
     */
    public void processOrderLine(List<ProductItem> productItems, int listIndex) {
        System.out.println("COCO");
        System.out.println(productItems.get(listIndex));

        ProductItem item = productItems.get(listIndex);
        item.addStatusToMap(ProductItem.status.READY_FOR_TRANSIT);

        printItemInfo(item);

        item.setBox(null);
        /* Save item */
        pir.save(item); //TODO  AANZETTEN NA TESTEN
    }


    /**
     * Send order to customer by CustomerOrderId <-- get method
     * Order gets status SHIPPED_TO_CUSTOMER <-- set status to shiped
     * All CustomerOrderLines in order stay in system.
     * All CustomerOrderPickingLInes are removed from the database
     */
    public void shipCustomerOrder(long customerOrderId) {
        CustomerOrder order = cor.findById(customerOrderId).get();
        if (order == null) {
            System.out.println(Utils.ic(Utils.ANSI_RED, "WARNING: ORDER TO SHIP DOES NOT EXIST"));
        } else {
            /* Add status to order */
            order.addStatusToMap(CustomerOrder.status.SHIPPED_TO_CUSTOMER);

            /* Delete picking lines that are linked to order line*/
            List<CustomerOrderLine> customerOrderLines = cos.getAllCustomerOrderLines(customerOrderId);
            for (CustomerOrderLine entry : customerOrderLines) {
                List<CustomerOrderPickingLine> pickingLines = coplr.findCustomerOrderPickingLineBy(entry.getId());
                if (pickingLines.size() > 0) {
                    for (CustomerOrderPickingLine pickingLine : pickingLines) {
                        System.out.println(Utils.ic(Utils.ANSI_RED, "Deleting CustomerOrderPickingLine with id: " + pickingLine.getId()));
                        coplr.delete(pickingLine);
                    }
                }
            }

            /* Ship all items by changing status to CHECKED_OUT*/
            shipItems();
            System.out.println(Utils.ic(Utils.ANSI_GREEN, "Shipping order completed for order: " + order.getId()));
        }
    }

    public void shipItems() {
        Iterable<ProductItem> productItems = pir.findAll();
        for (ProductItem item : productItems) {
            if (item.getCurrentStatus() == ProductItem.status.READY_FOR_TRANSIT) {
                item.addStatusToMap(ProductItem.status.CHECKED_OUT);
                System.out.println(Utils.ic(Utils.ANSI_BLUE, "Item with id: " + item.getId()
                        + " is now shipped. Current status: " + item.getCurrentStatus()));
            }
        }
    }

    /* PRINT METHODS */
    public void printPickingLineInfo(Iterable<CustomerOrderPickingLine> pickingLines) {
        for (CustomerOrderPickingLine line : pickingLines) {
            System.out.println("Keys: Boxnumbers");
            System.out.println("Values: Quantity");
            System.out.println(line.getBoxQuantityMap().keySet());
            System.out.println(line.getBoxQuantityMap().values());
        }
    }

    public void printOrderInfo(CustomerOrder nextOrderToPick) {
        System.out.println(Utils.ic(Utils.ANSI_GREEN, "Next order to pick " +
                "\n\tOrder ID: " + nextOrderToPick.getId() +
                "\n\tCurrent status: " + nextOrderToPick.getCurrentStatus() +
                "\n\tLocalDateTime status: " + nextOrderToPick.getCurrentStatusLocalDateTime() +
                "\n\tOrderLines: " + getCustomerOrderLinesById(nextOrderToPick.getId())));
    }

    public void printItemInfo(ProductItem item) {
        System.out.println(item.getCurrentStatus());

        System.out.println("item id : " + item.getId());
        System.out.println("before nulling box    = " + item.getBox());
        System.out.println("before nulling box id = " + item.getBox().getId());
    }
}

