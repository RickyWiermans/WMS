package nl.group.wms.api;

import nl.group.wms.controller.FileDataService;
import nl.group.wms.domein.FileData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class FileDataEndpoint {

    @Autowired
    FileDataService fileDataService;

    @GetMapping("/getAllFileData")
    public Iterable<FileData> getAllFileData() {
        return fileDataService.getAllFileData();
    }

    @GetMapping("/getLastFileDataId")
    public Long getLastFileDataId() {
        Iterable<FileData> allFileData = fileDataService.getAllFileData();
        FileData lastElement = null;
        for (FileData element : allFileData) {
            lastElement = element;
        }
        return lastElement.getId();
    }


    @GetMapping("/fileData/{id}")
    public Optional<FileData> getFileDataById(@PathVariable long id) {
        return fileDataService.getFileData(id);
    }

    @PostMapping("/postFileData")
    public FileData postFileData(@RequestBody FileData fileData) {
        return fileDataService.save(fileData);
    }

    /* Rewrite for FileData */
//    @PostMapping("/ptest/{id}/image")
//    public void addImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
//        System.out.println("wezijn hier");
//        Optional<PTest> zonderafbeelding = pTestService.getPTest(id);
//        zonderafbeelding.get().setDatafoto(file.getBytes());
//        pTestService.save(zonderafbeelding.get());
//    }

    /* Rewrite for FileData */
//    @DeleteMapping("/ptest/{id}")
//    public void pTestDelete(@PathVariable long id) {
//        pTestService.remove(id);
//    }

    /* Rewrite for FileData */
//    @PutMapping("/ptest")
//    public PTest pTestChange(@RequestBody PTest pTest) {
//        pTestService.save(pTest);
//        return pTest;
//    }

}
