
package com.dev2life.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Dev2Life API funcionando!";
    }

    @GetMapping("/api/status")
    public String status() {
        return "Backend conectado e funcionando!";
    }
}
