package nl.group.wms.controller;

import nl.group.wms.domein.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class BoxService {

    @Autowired
    BoxRepository br;

    @Autowired
    ProductRepository pr;

    @Autowired
    ProductItemRepository pir;

    @Autowired
    BackOrderDeliveryRepository bodr;

    @Autowired
    BackOrderDeliveryStorageRepository bodsr;

    public Iterable<Box> getAllBoxes() {
        Iterable<Box> boxes = br.findAll();
        return boxes;
    }

    /* NEW */
    public Iterable<Box> getAllBoxesWithProduct(long productId) {
        Iterable<Box> boxes = br.findByProduct(productId);
        return boxes;
    }

    /* NEW */
    public List<Long> getAllBoxidsWithProduct(Long productId) {
        Iterable<Box> boxes = br.findByProduct(productId);
        List<Long> ids = new ArrayList<>();
        for (Box box : boxes) {
            ids.add(box.getId());
        }
        return ids;
    }

    /* NEW */
    public Long getNumberOfItemsInBox(long boxId) {
        System.out.println(pir.countByBoxId(boxId));
        return pir.countByBoxId(boxId);
    }

    /* NEW */
    public HashMap<Long, Long> getAllBoxidsAndQuantityStored(Long productId) {
        HashMap<Long, Long> result = new HashMap<>();
        List<Long> ids = getAllBoxidsWithProduct(productId);
        for (Long id : ids) {
            result.put(id, getNumberOfItemsInBox(id));
        }
        return result;
    }


    public void newBox(Box box, Long productId) {

        box.setProduct(pr.findById(productId).get());
        br.save(box);
    }

    public List<Box> findEmptySpots(long productId, int amountToStore) {
        //Product product = pr.findById(productId).get();
        List<Box> boxes = br.findByProduct(productId);
        List<Box> availableBoxes = new ArrayList<Box>();
        for (Box box : boxes) {
            int currentAmount = (box.getCurrentItemsCheckedIn() + box.getCurrentItemsInStorage() + box.getCurrentItemsReserved());
            int maxAmount = box.getMaxProductItems();
            if (currentAmount == maxAmount) {
                continue;
            } else {
                availableBoxes.add(box);
                amountToStore -= (maxAmount - currentAmount);
                if (amountToStore <= 0) break;
            }
        }
        return availableBoxes;
    }


    public void createStorageLines(long deliveryId) {
        BackOrderDelivery delivery = bodr.findById(deliveryId).get();
        for (BackOrderLine line : delivery.getLines()) {
            long productId = line.getProduct().getId();
            int amountToStore = line.getAmountReceived();
            List<Box> boxes = findEmptySpots(productId, amountToStore);
            for (Box box : boxes) {
                int emptyStorage = (box.getMaxProductItems() - (box.getCurrentItemsCheckedIn() + box.getCurrentItemsInStorage() + box.getCurrentItemsReserved()));
                int storeAmount = (amountToStore >= emptyStorage) ? emptyStorage : amountToStore;
                for (int x = 0; x < storeAmount; x++) {
                    ProductItem item = pir.findFirstByCurrentStatusAndProductAndBox(ProductItem.status.CHECKED_IN, line.getProduct(), null);
                    item.setBox(box);
                    pir.save(item);
                }
                BackOrderDeliveryStorage storageLine = new BackOrderDeliveryStorage();
                storageLine.setAmountToStore(storeAmount);
                storageLine.setBox(box);
                storageLine.setDelivery(delivery);
                storageLine.setProduct(line.getProduct());
                bodsr.save(storageLine);
                amountToStore -= storeAmount;
            }
        }
    }

    public List<BackOrderDeliveryStorage> getStorageLines(long deliveryId) {
        return bodsr.findByBackOrderDelivery(deliveryId);

    }

    public void confirmStorageLine(long storageLineId, int actuallyStored) {
        BackOrderDeliveryStorage storageLine = bodsr.findById(storageLineId).get();
        storageLine.setStorageConfirmed(true);
        storageLine.setActuallyStored(actuallyStored);
        bodsr.save(storageLine);
        for (int x = 0; x < actuallyStored; x++) {
            ProductItem item = pir.findFirstByCurrentStatusAndProductAndBox(ProductItem.status.CHECKED_IN,
                    storageLine.getProduct(), storageLine.getBox());
            item.addStatusToMap(ProductItem.status.IN_STORAGE);
            pir.save(item);
        }
        if (storageLine.getAmountToStore() > actuallyStored) {
            int deviation = (storageLine.getAmountToStore() - actuallyStored);
            for (int y = 0; y < deviation; y++) {
                ProductItem item = pir.findFirstByCurrentStatusAndProductAndBox(ProductItem.status.CHECKED_IN,
                        storageLine.getProduct(), storageLine.getBox());
                pir.delete(item);
            }
            if (deviation > 1) { //rare bug dat de laatste in de loop niet verwijderd wordt (snelle oplossing)
            	ProductItem item = pir.findFirstByCurrentStatusAndProductAndBox(ProductItem.status.CHECKED_IN,
                        storageLine.getProduct(), storageLine.getBox());
                pir.delete(item);
            }
        }

    }
    
    public void deleteBox(long id) {
        Box box = br.findById(id).get();
        List<ProductItem> items = pir.findByBox(box);
        for (ProductItem item: items) {
        	pir.delete(item);
        }
        br.delete(box);
    }


}