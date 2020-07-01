package nl.group.wms.domein;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import nl.group.wms.domein.ProductItem.status;

@Entity
public class BackOrderDelivery {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private int member;
	private boolean complete;
	private LocalDate deliveryDate;
	private String licensePlateDeliverer;
	private boolean deviating;
	public enum status {EXPECTED,ARRIVED,NEEDS_RESOLVING,COMPLETE,STORED};
	@Column(columnDefinition = "LONGBLOB")
	private HashMap<LocalDateTime, Enum<status>> statusMap = new HashMap<>(); 
	private Enum currentStatus;
	@OneToMany
	private List<BackOrderLine> lines;
	
	
	public void addStatusToMap(Enum status){
        statusMap.put(LocalDateTime.now(),status);
        currentStatus = status;
    }
	
	public Enum getCurrentStatus() {
		return currentStatus;
	}
	public void setCurrentStatus(Enum currentStatus) {
		this.currentStatus = currentStatus;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getMember() {
		return member;
	}
	public void setMember(int member) {
		this.member = member;
	}
	public boolean isComplete() {
		return complete;
	}
	public void setComplete(boolean complete) {
		this.complete = complete;
	}
	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}
	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}
	public String getLicensePlateDeliverer() {
		return licensePlateDeliverer;
	}
	public void setLicensePlateDeliverer(String licensePlateDeliverer) {
		this.licensePlateDeliverer = licensePlateDeliverer;
	}
	public boolean isDeviating() {
		return deviating;
	}
	public void setDeviating(boolean deviating) {
		this.deviating = deviating;
	}
	public HashMap<LocalDateTime, Enum<status>> getStatusMap() {
		return statusMap;
	}
	public void setStatusMap(HashMap<LocalDateTime, Enum<status>> statusMap) {
		this.statusMap = statusMap;
	}
	public List<BackOrderLine> getLines() {
		return lines;
	}
	public void setLines(List<BackOrderLine> lines) {
		this.lines = lines;
	}
	
}
