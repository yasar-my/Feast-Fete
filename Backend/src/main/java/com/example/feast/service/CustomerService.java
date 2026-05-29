package com.example.feast.service;

import com.example.feast.model.Customer;
import com.example.feast.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    public Customer registerCustomer(Customer customer) {
        if (repo.findByEmail(customer.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }
        return repo.save(customer);
    }
    public boolean authenticateCustomer(String email, String password) {
        Customer customer = repo.findByEmail(email);
        if (customer != null && customer.getPassword().equals(password)) {
            return true;
        }
        return false;
    }

    public Customer getCustomerByEmail(String email) {
        return repo.findByEmail(email);
    }


    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }
    public void deleteCustomer(Long id) {
        repo.deleteById(id);
    }
}
