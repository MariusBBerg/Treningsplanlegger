-- Set values for username, database name, and password
SET username = 'username';
SET database_name = 'treningsplanlegging';
SET user_password = 'password';

-- Check if the role exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = username) THEN
        EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', username, user_password);
    END IF;
END $$;

-- Check if the database exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = database_name) THEN
        EXECUTE format('CREATE DATABASE %I OWNER %I', database_name, username);
    END IF;
END $$;
