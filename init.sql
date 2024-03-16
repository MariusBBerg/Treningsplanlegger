-- Check if the role exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :POSTGRES_USER) THEN
        EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :POSTGRES_USER, :POSTGRES_PASSWORD);
    END IF;
END $$;

-- Check if the database exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = :POSTGRES_DB) THEN
        EXECUTE format('CREATE DATABASE %I OWNER %I', :POSTGRES_DB, :POSTGRES_USER);
    END IF;
END $$;
