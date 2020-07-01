package nl.group.wms.controller;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import nl.group.wms.domein.BackOrderDelivery;

@Component
public interface BackOrderDeliveryRepository extends CrudRepository<BackOrderDelivery, Long>{

}
