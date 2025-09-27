FROM openjdk:17-jdk-slim

WORKDIR /app

# Install bash, curl and Maven
RUN apt-get update && \
    apt-get install -y bash curl maven && \
    rm -rf /var/lib/apt/lists/*

# Copy common module first
COPY ../common ../common

# Build and install common module
RUN cd ../common && mvn clean install -DskipTests

# Copy pom.xml for dependency caching
COPY pom.xml .

# Download dependencies (now common is available)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8083
CMD ["java", "-jar", "target/observance-service-1.0.0.jar"]