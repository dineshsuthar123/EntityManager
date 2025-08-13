## Multi-stage Dockerfile for Spring Boot on Render

# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
# Use --no-transfer-progress to reduce logs; skip tests for faster build
RUN mvn -q -DskipTests --no-transfer-progress package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/project1-1.0-SNAPSHOT.jar app.jar
# Render provides PORT env var; pass it to Spring Boot
ENV JAVA_OPTS=""
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar app.jar"]
