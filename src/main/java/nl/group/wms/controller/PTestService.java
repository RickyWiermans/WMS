package nl.group.wms.controller;

import nl.group.wms.domein.PTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PTestService {
    @Autowired
    PTestRepository pTestRep;

    public Iterable<PTest> getAllPTest() {
        return pTestRep.findAll();
    }


    public Optional<PTest> getPTest(Long id) {
        return pTestRep.findById(id);
    }

    public PTest save(PTest pTest) {
        return pTestRep.save(pTest);
    }

    public void remove(Long id) {
        pTestRep.deleteById(id);
    }

    public List<PTest> searchname(String string) {
        return pTestRep.searchForName(string);
    }


}