-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create buildings table
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    building_type VARCHAR(50),
    floors INTEGER,
    capacity INTEGER,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create facilities table
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    description TEXT,
    opening_hours JSONB,
    contact_info JSONB,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create paths table
CREATE TABLE paths (
    id SERIAL PRIMARY KEY,
    start_point GEOMETRY(Point, 4326) NOT NULL,
    end_point GEOMETRY(Point, 4326) NOT NULL,
    length_meters FLOAT NOT NULL,
    path_type VARCHAR(50),
    is_accessible BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_paths_updated_at
    BEFORE UPDATE ON paths
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_buildings_geom ON buildings USING GIST (geom);
CREATE INDEX idx_facilities_geom ON facilities USING GIST (geom);
CREATE INDEX idx_paths_start_point ON paths USING GIST (start_point);
CREATE INDEX idx_paths_end_point ON paths USING GIST (end_point);

-- Create feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create voice commands table
CREATE TABLE voice_commands (
    id SERIAL PRIMARY KEY,
    trigger VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default voice commands
INSERT INTO voice_commands (trigger, action, description) VALUES
('导航到', 'navigate', '导航到指定位置'),
('搜索', 'search', '搜索校园设施'),
('分享位置', 'share', '分享当前位置'),
('返回', 'back', '返回上一级'),
('主菜单', 'menu', '返回主菜单');
