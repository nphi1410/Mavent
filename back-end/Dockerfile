# ---- Stage 1: Build with Maven and JDK 21 ----
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy all source code
COPY . .

# Build the application (skipping tests for faster build)
RUN mvn clean package -DskipTests

# ---- Stage 2: Run with lightweight JDK 21 image ----
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/dev-0.0.1-SNAPSHOT.jar .
COPY src/main/resources/truststore.jks truststore.jks

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "dev-0.0.1-SNAPSHOT.jar"]
