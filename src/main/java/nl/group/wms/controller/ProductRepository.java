package nl.group.wms.controller;

import nl.group.wms.domein.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

@Component
public interface ProductRepository extends CrudRepository<Product, Long> {

}
