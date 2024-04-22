# Bruk en OpenJDK-basert image for Java-applikasjoner
FROM openjdk:21 AS build

# Sett arbeidskatalogen til /app

ENV SPRING_DATASOURCE_USERNAME=mariusbakkenberg
ENV SPRING_DATASOURCE_PASSWORD=1fAL6lN07Nv5M13UH9PwkJxiPLEQnl0J
ENV JWT_SECRET_KEY="eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMzYwNzI0NywiaWF0IjoxNzEzNjA3MjQ3fQ.7vqTkocAVp5MzH6zmh4at_VLVW5Vzf7nQb2QSSLtRoU"
ENV FRONTEND_URL=http://localhost:3000
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-cohr57djm4es739dnla0-a.frankfurt-postgres.render.com/treningsplanleggingdb


WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]