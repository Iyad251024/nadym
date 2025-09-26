FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Maven directly instead of using wrapper
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Copy common module
COPY ../common ../common

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8085
CMD ["java", "-jar", "target/teleexpertise-service-1.0.0.jar"]