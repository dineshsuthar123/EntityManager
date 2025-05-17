# Project1 - Java Full Stack Development with Spring Boot

This project is a basic Spring Boot application that demonstrates full stack development using Java, Spring Boot, Hibernate ORM, and more. 

## Project Structure

```
project1
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── project1
│   │   │               ├── Project1Application.java
│   │   │               ├── controller
│   │   │               │   └── HomeController.java
│   │   │               ├── model
│   │   │               │   └── Entity.java
│   │   │               ├── repository
│   │   │               │   └── EntityRepository.java
│   │   │               └── service
│   │   │                   └── EntityService.java
│   │   └── resources
│   │       ├── application.properties
│   │       ├── static
│   │       └── templates
│   │           └── index.html
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── project1
│                       └── Project1ApplicationTests.java
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven
- An IDE (e.g., IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd project1
   ```

3. Build the project using Maven:
   ```
   mvn clean install
   ```

### Running the Application

To run the application, use the following command:
```
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### Accessing the Application

Open your web browser and go to `http://localhost:8080` to view the home page.

## Features

- Basic CRUD operations using Spring Data JPA and Hibernate ORM.
- A simple web interface using Thymeleaf templates.
- RESTful API endpoints for handling HTTP requests.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.