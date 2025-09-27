# backend/api-gateway/Dockerfile
FROM nadym-base:latest

# Copy common module first
COPY common ./common

# Build and install common module
RUN cd common && mvn clean install -DskipTests

# Copy service files
COPY backend/teleexpertise-service/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code
COPY backend/teleexpertise-service/src ./src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8085
CMD ["java", "-jar", "target/teleexpertise-service-1.0.0.jar"]