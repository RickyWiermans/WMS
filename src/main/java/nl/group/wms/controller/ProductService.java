package nl.group.wms.controller;

import nl.group.wms.Utils;
import nl.group.wms.domein.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    @Autowired
    ProductRepository pr;

    public Iterable<Product> getAllProducts() {
        Iterable<Product> producten = pr.findAll();
        return producten;
    }


    public void newProduct(Product product) {
        pr.save(product);
    }

    public void deleteProduct(Long id) {
        System.out.println(pr.findById(id).get().getName() + " is removed");
        pr.deleteById((long) id);
    }

    public void editProduct(Product product) {
        System.out.println(Utils.ic(Utils.ANSI_RED, "updated product " + product.getName()));
        pr.save(product);
    }


    public Product getProduct(Long id) {
        System.out.println("Ik kom hier" + id);
        Product product = pr.findById(id).get();
        return product;
    }

}