package nl.group.wms.controller;

import nl.group.wms.domein.PTest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public interface PTestRepository extends CrudRepository<PTest, Long> {
    @Query("SELECT u FROM Product u WHERE u.name = ?1")
    List<PTest> searchForName(String string);

}
