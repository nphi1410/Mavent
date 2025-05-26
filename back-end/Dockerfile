# ---- Stage 1: Build with Maven and JDK 21 ----
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only pom.xml first to leverage caching of dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source
COPY src ./src

# Build the application (skipping tests for faster build)
RUN mvn clean package -DskipTests

# ---- Stage 2: Lightweight Runtime Image ----
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/dev-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/truststore.jks truststore.jks

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
