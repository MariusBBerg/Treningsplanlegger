-- Check if the role exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin2') THEN
        CREATE ROLE admin2 WITH LOGIN PASSWORD 'admin2';
    END IF;
END $$;

-- Check if the database exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'treningsplanleggingdb') THEN
        CREATE DATABASE treningsplanleggingdb OWNER admin2;
    END IF;
END $$;
