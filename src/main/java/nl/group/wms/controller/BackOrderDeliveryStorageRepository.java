package nl.group.wms.controller;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import nl.group.wms.domein.BackOrderDelivery;
import nl.group.wms.domein.BackOrderDeliveryStorage;

@Component
public interface BackOrderDeliveryStorageRepository extends CrudRepository<BackOrderDeliveryStorage, Long> {

	@Query(value="select * from back_order_delivery_storage a where a.delivery_id=:deliveryId", nativeQuery=true)
	List<BackOrderDeliveryStorage> findByBackOrderDelivery(long deliveryId);
}
