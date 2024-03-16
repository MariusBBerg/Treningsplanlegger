# Bruk en OpenJDK-basert image for Java-applikasjoner
FROM openjdk:21 as build

# Sett arbeidskatalogen til /app
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn

COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

copy src src

RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)


# Bruk en OpenJDK-basert image for Java-applikasjoner
FROM openjdk:21

ARG DEPENDENCY=/app/target/dependency

# Kopierer avhengigheter fra byggeimage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Kjører applikasjonen
ENTRYPOINT ["java","-cp","app:app/lib/*","com.treningsplanlegging.treningsplanlegging.TreningsplanleggingApplication"]