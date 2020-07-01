package nl.group.wms.controller;

import nl.group.wms.domein.CustomerOrderPickingLine;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface CustomerOrderPickingLineRepository extends CrudRepository<CustomerOrderPickingLine, Long> {
    List<CustomerOrderPickingLine> findByCustomerOrderLineId(Long orderId);

    @Query(value = "select count(*) from customer_order_picking_line p where p.customer_order_line_id=:coli",
            nativeQuery = true)
    public long customerOrderPickingLineExistsBy(@Param("coli") long customerOrderLineId);


    @Query(value = "select * from customer_order_picking_line p where p.customer_order_line_id=:coli",
            nativeQuery = true)
    public List<CustomerOrderPickingLine> findCustomerOrderPickingLineBy(@Param("coli") long customerOrderLineId);


}
