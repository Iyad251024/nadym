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
COPY dcc-service/pom.xml ./
COPY dcc-service/src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8087
CMD ["java", "-jar", "target/dcc-service-1.0.0.jar"]