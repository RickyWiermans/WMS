package nl.group.wms.controller;

import nl.group.wms.domein.Box;
import nl.group.wms.domein.ProductItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@Transactional
public class ProductItemService {

    @Autowired
    ProductItemRepository productItemRep;

    @Autowired
    ProductRepository productRep;

    @Autowired
    BoxRepository BoxRep;

    public Iterable<ProductItem> getAllProductItems() {
        Iterable<ProductItem> productItems = productItemRep.findAll();
        return productItems;
    }

    /**
     * Get roductItem stausMap
     *
     * @return statusMap
     */
    public HashMap<LocalDateTime, Enum<ProductItem.status>> getProductItemStatus(Long productItemId) {
        HashMap<LocalDateTime, Enum<ProductItem.status>> statusMap = productItemRep.findById(productItemId).get().getStatusMap();
        return statusMap;
    }

    /**
     * Add new productItem
     */
    public void newProductItem(ProductItem productItem) {
        productItem.addStatusToMap(ProductItem.status.CHECKED_IN);
        productItemRep.save(productItem);
        //productRep.findById(productItem.getProduct().getId()).get().increaseStock(1);
    }


    /**
     * Store productItem in a box
     */
    public void storeProductItem(Long productItemId, Long BoxId) {
        ProductItem productItem = productItemRep.findById(productItemId).get();
        Box box = BoxRep.findById(BoxId).get();

        productItem.addStatusToMap(ProductItem.status.IN_STORAGE);

        productItem.setBox(box);
    }


}