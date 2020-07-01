package nl.group.wms.controller;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import nl.group.wms.domein.BackOrder;

@Component
public interface BackOrderRepository extends CrudRepository<BackOrder, Long>{

}
