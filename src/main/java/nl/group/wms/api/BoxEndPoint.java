package nl.group.wms.api;

import nl.group.wms.Utils;
import nl.group.wms.controller.BoxService;
import nl.group.wms.domein.BackOrderDeliveryStorage;
import nl.group.wms.domein.Box;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
public class BoxEndPoint {

    @Autowired
    BoxService bs;

 /*  @Autowired
    ProductItem pri;*/

    @GetMapping("/allboxes")
    public Iterable<Box> getAllProducts() {
        Iterable<Box> boxes = bs.getAllBoxes();
        return boxes;
    }

    /*@GetMapping("/itemsinbox")
    public int getItemsInBox() {
        List<ProductItem> findByBoxId(ProductItem);
    }*/

    @PostMapping("/newbox/{productId}")
    public void addNewBox(@RequestBody Box box, @PathVariable Long productId) {
        System.out.println(Utils.ic(Utils.ANSI_CYAN, "Added a new box: " + box.getId()));
        bs.newBox(box, productId);
    }

    /* NEW */
    @GetMapping("/getAllBoxesWithProduct/{productId}")
    public Iterable<Box> getAllBoxesWithProduct(@PathVariable long productId) {
        return bs.getAllBoxesWithProduct(productId);
    }

    /* NEW */
    @GetMapping("/getAllBoxIdsWithProduct/{productId}")
    public Iterable<Long> getAllBoxIdsWithProduct(@PathVariable long productId) {
        return bs.getAllBoxidsWithProduct(productId);
    }

    /* NEW */
    @GetMapping("getItemsInBox/{boxId}")
    public long getItemsInBox(@PathVariable long boxId) {
        return bs.getNumberOfItemsInBox(boxId);
    }

    /* NEW */
    @GetMapping("getBoxIdsAndQuantityStored/{productId}")
    public HashMap<Long, Long> getBoxIdsAndQuantityStored(@PathVariable long productId) {
        // KEY   : boxId
        // VALUE : quantityStored
        return bs.getAllBoxidsAndQuantityStored(productId);
    }

//    @GetMapping("/deleteproduct")
//    public void deleteExistingProduct() {
//        ps.deleteProduct(2);
//    }

    @GetMapping("/findEmptySpots/{productId}/{amountToStore}")
    public List<Box> findEmptySpots(@PathVariable long productId, @PathVariable int amountToStore) {
        return bs.findEmptySpots(productId, amountToStore);
    }

    @PostMapping("/createStorageLines/{deliveryId}")
    public void createStorageLines(@PathVariable long deliveryId) {
        bs.createStorageLines(deliveryId);
    }

    @GetMapping("/getStorageLines/{deliveryId}")
    public List<BackOrderDeliveryStorage> getStorageLines(@PathVariable long deliveryId) {
        return bs.getStorageLines(deliveryId);
    }
    
    @PostMapping("/confirmStorageLine/{storageLineId}/{actuallyStored}")
    public void confirmStorageLine(@PathVariable long storageLineId, @PathVariable int actuallyStored) {
    	bs.confirmStorageLine(storageLineId, actuallyStored);
    }
    
    @DeleteMapping("/deleteBox/{id}")
    public void deleteBox(@PathVariable long id) {
        bs.deleteBox(id);
    }


}