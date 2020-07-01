package nl.group.wms.controller;

import nl.group.wms.domein.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface CustomerRepository extends CrudRepository<Customer, Long> {
    long countByLastName(String lastName);

    List<Customer> findByLastName(String lastName);
}
