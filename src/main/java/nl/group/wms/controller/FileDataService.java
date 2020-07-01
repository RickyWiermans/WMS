package nl.group.wms.controller;

import nl.group.wms.domein.FileData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FileDataService {

    @Autowired
    FileDataRepository fileDataRep;


    public Iterable<FileData> getAllFileData() {
        return fileDataRep.findAll();
    }


    public Optional<FileData> getFileData(Long id) {
        return fileDataRep.findById(id);
    }

    public FileData save(FileData fileData) {
        return fileDataRep.save(fileData);
    }

    public void remove(Long id) {
        fileDataRep.deleteById(id);
    }

}
