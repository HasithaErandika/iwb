-- Create the meetups table
CREATE TABLE IF NOT EXISTS meetups (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    event_start_date VARCHAR(50) NOT NULL,
    event_start_time VARCHAR(50) NOT NULL,
    event_end_date VARCHAR(50) NOT NULL,
    event_end_time VARCHAR(50) NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    venue_google_maps_url TEXT NOT NULL,
    is_paid_event BOOLEAN DEFAULT FALSE,
    event_cost DECIMAL(10,2),
    has_limited_capacity BOOLEAN DEFAULT FALSE,
    event_capacity INTEGER,
    require_approval BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_meetups_event_id ON meetups(event_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_meetups_created_at ON meetups(created_at);