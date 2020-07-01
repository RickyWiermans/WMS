package nl.group.wms.controller;

import nl.group.wms.domein.FileData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

@Component
public interface FileDataRepository extends CrudRepository<FileData, Long> {

}
