# backend/api-gateway/Dockerfile
FROM nadym-base:latest

# --- Étape 1 : copier et installer le module common ---
COPY common ./common
RUN cd common && mvn clean install -DskipTests

# --- Étape 2 : préparer le service api-gateway ---
COPY backend/api-gateway/pom.xml ./
RUN mvn dependency:go-offline -B

COPY backend/api-gateway/src ./src

# --- Étape 3 : build final ---
RUN mvn clean package -DskipTests

EXPOSE 8081
CMD ["java", "-jar", "target/api-gateway-1.0.0.jar"]
