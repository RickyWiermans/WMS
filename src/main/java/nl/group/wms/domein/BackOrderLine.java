package nl.group.wms.domein;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class BackOrderLine {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@ManyToOne
	private BackOrder backOrder;
	//private String product;
	@ManyToOne
	private Product product;
	private int amount;
	private boolean deliveryConfirmed;
	private boolean needsResolving;
	private boolean isResolved;
	private int amountReceived;
	
	
	
	public boolean isResolved() {
		return isResolved;
	}
	public void setResolved(boolean isResolved) {
		this.isResolved = isResolved;
	}
	public boolean isDeliveryConfirmed() {
		return deliveryConfirmed;
	}
	public void setDeliveryConfirmed(boolean deliveryConfirmed) {
		this.deliveryConfirmed = deliveryConfirmed;
	}
	public boolean isNeedsResolving() {
		return needsResolving;
	}
	public void setNeedsResolving(boolean needsResolving) {
		this.needsResolving = needsResolving;
	}
	public int getAmountReceived() {
		return amountReceived;
	}
	public void setAmountReceived(int amountReceived) {
		this.amountReceived = amountReceived;
	}
	public long getId() {
		return id;
	}
	public BackOrder getBackOrder() {
		return backOrder;
	}
	public void setBackOrder(BackOrder backOrder) {
		this.backOrder = backOrder;
	}
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	
	
}
