package nl.group.wms.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import nl.group.wms.controller.PlaceBackOrderService;
import nl.group.wms.domein.BackOrder;
import nl.group.wms.domein.BackOrderDelivery;
import nl.group.wms.domein.BackOrderLine;
import nl.group.wms.domein.Product;

@RestController
public class PlaceBackOrderEndpoint {
	
	@Autowired
	PlaceBackOrderService pbs;
	
	@PostMapping("/newBackOrder")
    public void addNewBackOrder(@RequestBody BackOrder backOrder){
        pbs.newBackOrder(backOrder);
    }
	@PostMapping("/newBackOrderLine")
    public long addNewBackOrderLine(@RequestBody BackOrderLine backOrderLine){
        return pbs.newBackOrderLine(backOrderLine);
    }
	
	@GetMapping("/getLatestBackOrderId")
	public long getBackOrderId() {
		return pbs.getLatestBackOrderId();	
	}
	@PostMapping("/newBODelivery")
    public long addNewBODelivery(@RequestBody BackOrderDelivery backOrderDelivery){
        return pbs.newBODelivery(backOrderDelivery);
    }
	@GetMapping("/allBODeliveries")
    public Iterable<BackOrderDelivery> getAllBODeliveries() {
        Iterable<BackOrderDelivery> deliveries = pbs.getAllBODeliveries();
        return deliveries;
    }
	@GetMapping("/getBODelivery/{id}")
    public BackOrderDelivery getBODelivery(@PathVariable long id) {
        BackOrderDelivery delivery = pbs.getBODelivery(id);
        return delivery;
    }
	
	@PostMapping("/connectDeliveryLine/{deliveryId}/{lineId}")
	public void addBOLineToDelivery(@PathVariable long deliveryId, @PathVariable long lineId) {
		pbs.addBOLineToDelivery(lineId, deliveryId);
	}
	@PostMapping("/setDeliveryArrived/{deliveryId}/{licensePlate}")
	public void setDeliveryArrived(@PathVariable long deliveryId, @PathVariable String licensePlate) {
		pbs.setDeliveryArrived(deliveryId, licensePlate);
	}
	@PostMapping("/updateBackOrderLine")
	public void updateBackOrderLine(@RequestBody BackOrderLine line) {
		pbs.updateBackOrderLine(line);
	}
	@GetMapping("/getBackOrderLine/{id}")
    public BackOrderLine getBOLine(@PathVariable long id) {
        BackOrderLine line = pbs.getBOLine(id);
        return line;
    }
	@PostMapping("/setDeliveryDeviating/{id}")
	public void setDeliveryDeviating(@PathVariable long id) {
		pbs.setDeliveryDeviating(id);
	}
	@PostMapping("/resolveDeviation/{id}")
	public void resolveDeviation(@PathVariable long id) {
		pbs.resolveDeviation(id);
	}
	@PostMapping("/completeDelivery/{id}")
	public void completeDelivery(@PathVariable long id) {
		pbs.completeDelivery(id);
	}
	@PostMapping("/setDeliveryStored/{id}")
	public void setDeliveryStored(@PathVariable long id) {
		pbs.setDeliveryStored(id);
	}
	@PostMapping("/deleteDelivery/{id}")
	public void deleteDelivery(@PathVariable long id) {
		pbs.deleteDelivery(id);
	}
	
}
