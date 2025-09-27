FROM openjdk:17-jdk-slim

WORKDIR /app

# Install bash, curl and Maven
RUN apt-get update && \
    apt-get install -y bash curl maven && \
    rm -rf /var/lib/apt/lists/*

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8087
CMD ["java", "-jar", "target/dcc-service-1.0.0.jar"]