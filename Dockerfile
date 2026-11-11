# Etapa 1: compila el backend y genera el .jar
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY backend/ ./backend/

WORKDIR /app/backend

RUN chmod +x mvnw && ./mvnw clean package -DskipTests


# Etapa 2: imagen final, más pequeña, solo para ejecutar la API
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar
COPY database/migrations/ ./database/migrations/

# Dentro del contenedor, Flyway leerá esta ubicación.
ENV FLYWAY_LOCATIONS=filesystem:/app/database/migrations

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]