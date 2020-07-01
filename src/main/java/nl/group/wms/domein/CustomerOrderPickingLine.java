package nl.group.wms.domein;

import javax.persistence.*;
import java.util.HashMap;

@Entity
public class CustomerOrderPickingLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @OneToOne
    private CustomerOrderLine customerOrderLine;
    @Column(columnDefinition = "LONGBLOB")
    HashMap<Long, Long> boxQuantityMap = new HashMap<>();

    public CustomerOrderPickingLine() {

    }

    public CustomerOrderPickingLine(CustomerOrderLine customerOrderLine, HashMap<Long, Long> boxQuantityMap) {
        this.customerOrderLine = customerOrderLine;
        this.boxQuantityMap = boxQuantityMap;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public CustomerOrderLine getCustomerOrderLine() {
        return customerOrderLine;
    }

    public void setCustomerOrderLine(CustomerOrderLine customerOrderLine) {
        this.customerOrderLine = customerOrderLine;
    }

    public HashMap<Long, Long> getBoxQuantityMap() {
        return boxQuantityMap;
    }

    public void setBoxQuantityMap(HashMap<Long, Long> boxQuantityMap) {
        this.boxQuantityMap = boxQuantityMap;
    }
}