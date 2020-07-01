package nl.group.wms.domein;

import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Box {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    private Product Product;
    private int length;
    private int width;
    private int height;
    private int maxProductItems;
    private int maxWeight;
    private int currentItems; //ongebruikt
    
    private int currentItemsCheckedIn;
    private int currentItemsInStorage;
    private int currentItemsReserved;
    
    
    @JsonIgnore
    @OneToMany(mappedBy="box")
    private List<ProductItem> items;
    
    @PostLoad
    private void updateItems() {
    	int checkedIn = 0, inStorage = 0, reserved = 0;
    	for(ProductItem item: items) {
    		if (item.getCurrentStatus() == ProductItem.status.CHECKED_IN) {
    			checkedIn++;
    		} else if (item.getCurrentStatus() == ProductItem.status.IN_STORAGE) {
    			inStorage++;
    		} else if (item.getCurrentStatus() == ProductItem.status.RESERVED) {
    			reserved++;
    		}
    	}
    	this.currentItemsCheckedIn = checkedIn;
    	this.currentItemsInStorage = inStorage;
    	this.currentItemsReserved = reserved;
    }
    
	public int getCurrentItemsCheckedIn() {
		return currentItemsCheckedIn;
	}
	public int getCurrentItemsInStorage() {
		return currentItemsInStorage;
	}
	public int getCurrentItemsReserved() {
		return currentItemsReserved;
	}
	
	
	public void increaseCurrentItems(int amount) {
    	if(amount > 0) this.currentItems += amount;
	}
    public void decreaseCurrentItems(int amount) {
		if (amount > 0) this.currentItems -= amount;
	}
    public int getCurrentItems() {
		return currentItems;
	}

	public void setCurrentItems(int currentItems) {
		this.currentItems = currentItems;
	}

	public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Product getProduct() {
        return Product;
    }

    public void setProduct(Product product) {
        Product = product;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getMaxProductItems() {
        return maxProductItems;
    }

    public void setMaxProductItems(int maxProductItems) {
        this.maxProductItems = maxProductItems;
    }

    public int getMaxWeight() {
        return maxWeight;
    }

    public void setMaxWeight(int maxWeight) {
        this.maxWeight = maxWeight;
    }


}
