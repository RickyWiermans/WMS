package nl.group.wms.domein;

import nl.group.wms.Utils;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Iterator;

@Entity
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public enum status {PRE_PURCHASE, READY_FOR_PICKING, SHIPPED_TO_CUSTOMER}

    @Column(columnDefinition = "LONGBLOB")
    private HashMap<LocalDateTime, Enum<status>> statusMap = new HashMap<>();
    @ManyToOne
    private Customer customer;

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public HashMap<LocalDateTime, Enum<status>> getStatusMap() {
        return statusMap;
    }

    public void setStatusMap(HashMap<LocalDateTime, Enum<status>> statusMap) {
        this.statusMap = statusMap;
    }

    public void addStatusToMap(Enum status) {
        System.out.println(Utils.ic(Utils.ANSI_GREEN, ("New customer order, added to statusMap: " + LocalDateTime.now() + ", " + status)));
        statusMap.put(LocalDateTime.now(), status);
//        for (LocalDateTime ld : statusMap.keySet()) {
//            System.out.println(ld);
//        }
//        for (Enum<status> ld : statusMap.values()) {
//            System.out.println(ld);
//        }

    }

//    public Enum<status> getCurrentStatus() {
//        Enum<status> result = null;
//        for (Enum<status> status : statusMap.values()) {
//            result = status;
//            System.out.println("Result = " + status);
//        }
//        return result;
//    }


    public Enum<status> getCurrentStatus() {

        LocalDateTime key = null;
        Iterator<LocalDateTime> iterator = statusMap.keySet().iterator();
        if (iterator.hasNext()) {
            key = iterator.next();
//            System.out.println("Key = " + key);
            while (iterator.hasNext()) {
                LocalDateTime next = iterator.next();
//                System.out.println("Next = " + next);
                if (next.isAfter(key)) {
                    key = next;
                }
            }
        }
//        System.out.println("Status = " + key);
//        System.out.println(statusMap.get(key));
        return statusMap.get(key);

    }

    public LocalDateTime getCurrentStatusLocalDateTime() {
        LocalDateTime result = null;
        for (LocalDateTime localDateTime : statusMap.keySet()) {
            result = localDateTime;
        }
        return result;
    }
}