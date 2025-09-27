FROM openjdk:17-jdk-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y bash curl maven && \
    rm -rf /var/lib/apt/lists/*

# Copy common module first
COPY common ./common

# Build and install common module
RUN cd common && mvn clean install -DskipTests

# Copy service files
COPY interoperability-service/pom.xml ./
COPY interoperability-service/src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8089
CMD ["java", "-jar", "target/interoperability-service-1.0.0.jar"]