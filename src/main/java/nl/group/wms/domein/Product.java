package nl.group.wms.domein;

import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private int width;              // mm	For later use
    private int height;             // mm	For later use
    private int length;             // mm	For later use
    private int weight;             // gr	For later use
    private int price;              // ct
    private int inStock;
    private long eanCode;
    private String description;
    @ManyToOne
    private FileData fileData;

    private int currentItemsCheckedIn;
    private int currentItemsInStorage;
    private int currentItemsReserved;
    @JsonIgnore
    @OneToMany(mappedBy="product")
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
    public int getInStock() {
        return inStock;
    }

    public void setInStock(int inStock) {
        this.inStock = inStock;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public long getEanCode() {
        return eanCode;
    }

    public void setEanCode(long eanCode) {
        this.eanCode = eanCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void increaseStock(int amount) {
        if (amount > 0) {
            this.inStock += amount;
        }
    }

    public void decreaseStock(int amount){
        if (amount > 0){
            this.inStock -= amount;
            System.out.println("amount decreased: " + amount);
        }
    }


    public FileData getFileData() {
        return fileData;
    }

    public void setFileData(FileData fileData) {
        this.fileData = fileData;
    }
}
