FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/financialmanager-0.0.1-SNAPSHOT.jar financialmanager-v1.0.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "financialmanager-v1.0.jar"]