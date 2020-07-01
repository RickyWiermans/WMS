package nl.group.wms.api;

import nl.group.wms.controller.PTestService;
import nl.group.wms.domein.PTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


@RestController
public class PTestEndpoint {
    @Autowired
    PTestService pTestService;

    @GetMapping("/ptest")
    public Iterable<PTest> getPTests() {
        return pTestService.getAllPTest();
    }

    @GetMapping("/ptest/zoeknaam")
    public List<PTest> getPTestByName(@RequestParam String naamstring) {
        List<PTest> result = pTestService.searchname(naamstring);
        return result;
    }

    @GetMapping("/ptest/{id}")
    public Optional<PTest> getPTestById(@PathVariable long id) {
        return pTestService.getPTest(id);
    }

    @PostMapping("/ptest")
    public PTest newPTest(@RequestBody PTest pTest) {
        PTest result = pTestService.save(pTest);
        return result;
    }

    @PostMapping("/ptestnext123")
    public void newPTest123(@RequestBody PTest pTest) {
        PTest result = pTestService.save(pTest);
    }

    @PostMapping("/ptest/{id}/image")
    public void addImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("wezijn hier");
        Optional<PTest> zonderafbeelding = pTestService.getPTest(id);
        zonderafbeelding.get().setDatafoto(file.getBytes());
        pTestService.save(zonderafbeelding.get());
    }

    @DeleteMapping("/ptest/{id}")
    public void pTestDelete(@PathVariable long id) {
        pTestService.remove(id);
    }

    @PutMapping("/ptest")
    public PTest pTestChange(@RequestBody PTest pTest) {
        pTestService.save(pTest);
        return pTest;
    }
}
