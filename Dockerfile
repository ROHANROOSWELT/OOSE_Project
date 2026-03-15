FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /app

# Copy the wrapper and pom
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Grant execution rights to python script if any, and maven wrapper
RUN chmod +x ./mvnw

# Download dependencies (this layer is cached)
RUN ./mvnw dependency:go-offline

# Copy application source
COPY src src

# Package the application
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
