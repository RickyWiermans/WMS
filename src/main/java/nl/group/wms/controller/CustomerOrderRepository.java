package nl.group.wms.controller;

import nl.group.wms.domein.CustomerOrder;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

@Component
public interface CustomerOrderRepository extends CrudRepository<CustomerOrder, Long> {
}
