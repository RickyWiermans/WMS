package nl.group.wms.domein;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class BackOrderDeliveryStorage {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	private Product product;
	@ManyToOne
	private BackOrderDelivery delivery;
	private int amountToStore;
	private int actuallyStored;
	@ManyToOne
	private Box box;
	private boolean storageConfirmed;
	
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	public BackOrderDelivery getDelivery() {
		return delivery;
	}
	public void setDelivery(BackOrderDelivery delivery) {
		this.delivery = delivery;
	}
	public int getAmountToStore() {
		return amountToStore;
	}
	public void setAmountToStore(int amountToStore) {
		this.amountToStore = amountToStore;
	}
	public int getActuallyStored() {
		return actuallyStored;
	}
	public void setActuallyStored(int actuallyStored) {
		this.actuallyStored = actuallyStored;
	}
	public Box getBox() {
		return box;
	}
	public void setBox(Box box) {
		this.box = box;
	}
	public boolean isStorageConfirmed() {
		return storageConfirmed;
	}
	public void setStorageConfirmed(boolean storageConfirmed) {
		this.storageConfirmed = storageConfirmed;
	}
	
	
}
