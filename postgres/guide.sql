-- PostgreSQL Bidirectional Replication Setup Guide
-- This guide provides step-by-step SQL commands to set up bidirectional replication
-- between two PostgreSQL databases using pglogical extension

-- =====================================================
-- STEP 1: SETUP USA DATABASE (DB1 - Primary)
-- =====================================================

-- Connect to DB1 (USA Database)
-- \c syncheddb;

-- Enable pglogical extension
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Create pglogical node for USA
SELECT pglogical.create_node(
    node_name := 'usa_node',
    dsn := 'host=pg_db1 port=5432 dbname=syncheddb user=postgres password=password'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add users table to default replication set
SELECT pglogical.replication_set_add_table('default', 'users');

-- Insert initial test data
INSERT INTO users (name, region) VALUES ('John Doe (USA)', 'USA');

-- =====================================================
-- STEP 2: SETUP ASIA DATABASE (DB2 - Secondary)
-- =====================================================

-- Connect to DB2 (Asia Database)
-- \c syncheddb;

-- Enable pglogical extension
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Create pglogical node for Asia
SELECT pglogical.create_node(
    node_name := 'asia_node',
    dsn := 'host=pg_db2 port=5432 dbname=syncheddb user=postgres password=password'
);

-- Create users table (same structure as USA)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copy initial data from USA database (manual step)
-- You can use pg_dump or manual INSERT statements

-- Add users table to default replication set
SELECT pglogical.replication_set_add_table('default', 'users');

-- =====================================================
-- STEP 3: ESTABLISH BIDIRECTIONAL REPLICATION
-- =====================================================

-- On ASIA DATABASE (DB2): Create subscription to USA
SELECT pglogical.create_subscription(
    subscription_name := 'asia_to_usa_subscription',
    provider_dsn := 'host=pg_db1 port=5432 dbname=syncheddb user=postgres password=password'
);

-- On USA DATABASE (DB1): Create subscription to Asia
SELECT pglogical.create_subscription(
    subscription_name := 'usa_to_asia_subscription',
    provider_dsn := 'host=pg_db2 port=5432 dbname=syncheddb user=postgres password=password'
);

-- =====================================================
-- STEP 4: VERIFICATION AND TESTING
-- =====================================================

-- Check replication status
SELECT * FROM pglogical.show_subscription_status();

-- Test INSERT on USA database
INSERT INTO users (name, region) VALUES ('Test User from USA', 'USA');

-- Test INSERT on Asia database
INSERT INTO users (name, region) VALUES ('Test User from Asia', 'ASIA');

-- Verify data synchronization
SELECT * FROM users ORDER BY created_at;

-- Test UPDATE operation
UPDATE users SET name = 'Updated User Name' WHERE region = 'USA' LIMIT 1;

-- Test DELETE operation
DELETE FROM users WHERE name LIKE '%Test%' LIMIT 1;

-- =====================================================
-- MONITORING AND MAINTENANCE
-- =====================================================

-- Check subscription status
SELECT subscription_name, status, provider_node, replication_sets 
FROM pglogical.show_subscription_status();

-- Check replication lag
SELECT * FROM pglogical.show_subscription_table();

-- View replication conflicts (if any)
SELECT * FROM pglogical.show_subscription_status() WHERE status != 'replicating';

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- Drop subscription (if needed to recreate)
-- SELECT pglogical.drop_subscription('subscription_name');

-- Drop node (if needed to recreate)
-- SELECT pglogical.drop_node('node_name');

-- Reset replication
-- SELECT pglogical.alter_subscription_resynchronize_table('subscription_name', 'table_name');

-- =====================================================
-- DOCKER COMMANDS FOR MANUAL EXECUTION
-- =====================================================

-- Connect to USA database container:
-- docker exec -it pg_db1 psql -U postgres -d syncheddb

-- Connect to Asia database container:
-- docker exec -it pg_db2 psql -U postgres -d syncheddb

-- Copy data between containers:
-- docker exec pg_db1 pg_dump -U postgres -d syncheddb --data-only --table=users | docker exec -i pg_db2 psql -U postgres -d syncheddb