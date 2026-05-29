package com.example.feast.controller;

import com.example.feast.model.Customer;
import com.example.feast.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerService service;

    @PostMapping("/register")
    public Customer registerCustomer(@RequestBody Customer customer) {
        return service.registerCustomer(customer);
    }
    @PostMapping("/login")
    public Map<String, Object> customerLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        boolean authenticated = service.authenticateCustomer(email, password);
        response.put("success", authenticated);

        if (authenticated) {
            response.put("email", email);
        }

        return response;
    }

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }
    @DeleteMapping("/delete/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
    }



}
