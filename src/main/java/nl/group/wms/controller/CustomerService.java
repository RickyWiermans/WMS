package nl.group.wms.controller;

import nl.group.wms.domein.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@EnableJpaRepositories
public class CustomerService {

    @Autowired
    CustomerRepository cr;

    @Autowired
    CustomerOrderRepository cor;

    @Autowired
    private JavaMailSender javaMailSender;

    public void findCustomerByLastName(String lastName) {
        List<Customer> customers = cr.findByLastName(lastName);
        for (Customer customer : customers) {
            System.out.println(customer.getEmail());
        }
    }

    public void addNewCustomer(Customer customer) {
        sendEmail(customer);
        cr.save(customer);
    }

    public Iterable<Customer> getAllCustomers() {
        Iterable<Customer> customers = cr.findAll();
        return customers;
    }


    public Customer getCustomer(long Id) {
        Customer customer = cr.findById(Id).get();
        return customer;
    }

//    public void addOrder(long customerOrderId, long customerId) {
//        Optional<CustomerOrder> customerOrder = cor.findById(customerOrderId);
//        Optional<Customer> customer = cr.findById(customerId);
//        Customer newOrder = customer.get();
//        newOrder.getCustomerOrders().add(customerOrder.get());
//        cr.save(newOrder);
//    }

    void sendEmail(Customer customer) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(customer.getEmail());
        msg.setSubject("Welcome to our WMS, " + customer.getFirstName() + " " + customer.getLastName());
        msg.setText("You can find hundreds of products in our warehouse!");
        javaMailSender.send(msg);
    }

}