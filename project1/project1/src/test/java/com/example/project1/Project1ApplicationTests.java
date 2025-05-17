package com.example.project1;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = Project1Application.class)
@Disabled("Temporarily disabled until all dependencies are resolved")
public class Project1ApplicationTests {

    @Test
    void contextLoads() {
    }

}