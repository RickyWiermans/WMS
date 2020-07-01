package nl.group.wms.controller;

import nl.group.wms.domein.CustomerOrderLine;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface CustomerOrderLineRepository extends CrudRepository<CustomerOrderLine, Long> {
    List<CustomerOrderLine> findByCustomerOrderId(Long orderId);
}
