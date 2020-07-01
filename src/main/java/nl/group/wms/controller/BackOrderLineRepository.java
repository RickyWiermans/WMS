package nl.group.wms.controller;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import nl.group.wms.domein.BackOrderLine;

@Component
public interface BackOrderLineRepository extends CrudRepository<BackOrderLine, Long> {

}
