package nl.group.wms;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class WmsApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void jojo() {
        int c = 3;
        Assertions.assertEquals(c, 3);
    }
}
