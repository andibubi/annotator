# Stufe 1: Bauen des JHipster-Projekts mit Java 17
FROM maven:3.8.8-eclipse-temurin-17 AS build

WORKDIR /app

# Kopiere die Maven-Konfigurationsdateien
COPY pom.xml ./
COPY package.json package-lock.json angular.json tsconfig.app.json tsconfig.json ./
COPY src ./src
COPY webpack ./webpack

# Baue die Anwendung
RUN mvn clean package -DskipTests

# Stufe 2: Erstellen des Laufzeit-Containers
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Kopiere das erzeugte JAR-File aus der ersten Stufe
COPY --from=build /app/target/*.jar app.jar

# Starte die Anwendung
ENTRYPOINT ["java", "-jar", "app.jar"]
