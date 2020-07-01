package nl.group.wms.domein;

import javax.persistence.*;

@Entity
public class CustomerOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int amountOrdered;
    private int amountPicked;
    private int price;
    boolean pickingConfirmed;
    @ManyToOne
    private Product product;
    @ManyToOne
    private CustomerOrder customerOrder;


    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public boolean isPickingConfirmed() {
        return pickingConfirmed;
    }

    public void setPickingConfirmed(boolean pickingConfirmed) {
        this.pickingConfirmed = pickingConfirmed;
    }

    public int getAmountOrdered() {
        return amountOrdered;
    }

    public void setAmountOrdered(int amountOrdered) {
        this.amountOrdered = amountOrdered;
    }

    public int getAmountPicked() {
        return amountPicked;
    }

    public void setAmountPicked(int amountPicked) {
        this.amountPicked = amountPicked;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n----line id: " + id);
        sb.append("\n\t\tamount: " + amountOrdered);
        sb.append("\n\t\tprice: " + price);
        sb.append("\n\t\tproductId: " + product.getName());
        sb.append("\n\t\tcustomerOrderId: " + customerOrder.getId());
        return sb.toString();
    }
}