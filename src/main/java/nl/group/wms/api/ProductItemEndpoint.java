package nl.group.wms.api;

import nl.group.wms.Utils;
import nl.group.wms.controller.ProductItemService;
import nl.group.wms.domein.ProductItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
public class ProductItemEndpoint {

    @Autowired
    ProductItemService ps;

    @GetMapping("/allproductitems")
    public Iterable<ProductItem> getAllProductItems() {
        Iterable<ProductItem> productItems = ps.getAllProductItems();
        return productItems;
    }


    /**
     * Get productItem.statusMap by Id
     *
     * @return HashMap <-- productItem.statusMap
     */
    @GetMapping("/productitemstatusmap/{productItemId}")
    public @ResponseBody
    HashMap<LocalDateTime, Enum<ProductItem.status>> getProductItemStatus(@PathVariable Long productItemId) {
        HashMap<LocalDateTime, Enum<ProductItem.status>> statusMap = ps.getProductItemStatus(productItemId);
        return statusMap;
    }

    /**
     * Add new ProductItem
     */
    @PostMapping("/newproductitem")
    public void addNewProduct(@RequestBody ProductItem productItem) {
        ps.newProductItem(productItem);
        System.out.println(Utils.ic(Utils.ANSI_CYAN, "A new productItem ID: " + productItem.getId()));
    }

    /**
     * Store productItem in a box
     */
    @PostMapping("/addprodcutitemtobox")
    public void storeProductItem(@RequestBody Long productItemId, Long BoxId) {
        ps.storeProductItem(productItemId, BoxId);
    }

}
